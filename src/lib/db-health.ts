import { supabase } from './supabase';

export interface DatabaseHealth {
  connected: boolean;
  tables: {
    users: boolean;
    links: boolean;
  };
  storage: {
    bucketExists: boolean;
    bucketPublic: boolean;
  };
  errors: string[];
  timestamp: string;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const health: DatabaseHealth = {
    connected: false,
    tables: {
      users: false,
      links: false,
    },
    storage: {
      bucketExists: false,
      bucketPublic: false,
    },
    errors: [],
    timestamp: new Date().toISOString(),
  };

  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(0);

    if (testError) {
      // If error is about missing table, that's okay - it means connection works
      if (testError.message.includes('relation') || testError.message.includes('does not exist')) {
        health.connected = true;
        health.errors.push('Tables not created yet. Run the SQL from SUPABASE_SETUP.md');
      } else {
        health.errors.push(`Connection error: ${testError.message}`);
      }
    } else {
      health.connected = true;
    }

    // Check users table
    try {
      const { error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (!usersError) {
        health.tables.users = true;
      } else if (!usersError.message.includes('does not exist')) {
        health.errors.push(`Users table error: ${usersError.message}`);
      }
    } catch (error: any) {
      health.errors.push(`Users table check failed: ${error.message}`);
    }

    // Check links table
    try {
      const { error: linksError } = await supabase
        .from('links')
        .select('id')
        .limit(1);

      if (!linksError) {
        health.tables.links = true;
      } else if (!linksError.message.includes('does not exist')) {
        health.errors.push(`Links table error: ${linksError.message}`);
      }
    } catch (error: any) {
      health.errors.push(`Links table check failed: ${error.message}`);
    }

    // Check storage bucket
    // Note: listBuckets() may require admin permissions, so we use direct access method
    try {
      // Use direct access method (try to list files in the bucket)
      // This works even with anon key if bucket is public and policies are set correctly
      const { data: files, error: filesError } = await supabase.storage
        .from('profile-pictures')
        .list('', {
          limit: 1,
        });

      if (!filesError) {
        // Success! Bucket exists and is accessible
        health.storage.bucketExists = true;
        health.storage.bucketPublic = true;
      } else {
        // Check the error type
        const errorMsg = filesError.message.toLowerCase();
        
        if (errorMsg.includes('bucket not found') || 
            errorMsg.includes('not found') || 
            errorMsg.includes('does not exist') ||
            errorMsg.includes('no such bucket')) {
          // Bucket definitely doesn't exist
          health.storage.bucketExists = false;
          health.errors.push('profile-pictures bucket not found. Create it in Supabase Storage.');
        } else if (errorMsg.includes('permission') || 
                   errorMsg.includes('unauthorized') ||
                   errorMsg.includes('forbidden')) {
          // Bucket might exist but we don't have permission
          // Since user says bucket exists, assume it exists but check public status
          health.storage.bucketExists = true;
          health.storage.bucketPublic = false;
          health.errors.push(`Bucket exists but may not be public or policies need configuration: ${filesError.message}`);
        } else {
          // Other error - assume bucket exists but log the error
          health.storage.bucketExists = true;
          health.storage.bucketPublic = false;
          health.errors.push(`Storage access error: ${filesError.message}`);
        }
      }

      // Also try listBuckets as a secondary check (might work with some permission setups)
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (!bucketError && buckets && Array.isArray(buckets)) {
          const profilePicturesBucket = buckets.find((b) => b.name === 'profile-pictures');
          if (profilePicturesBucket) {
            // Confirm bucket exists and get public status
            health.storage.bucketExists = true;
            if (profilePicturesBucket.public !== undefined) {
              health.storage.bucketPublic = profilePicturesBucket.public;
            }
          }
        }
      } catch (listError) {
        // listBuckets might fail due to permissions - that's okay, we already checked directly
        console.log('listBuckets not available (permission issue), using direct access method');
      }
    } catch (error: any) {
      health.errors.push(`Storage check failed: ${error.message}`);
      // Final fallback - assume bucket might exist if user says it does
      console.error('Storage health check error:', error);
    }
  } catch (error: any) {
    health.errors.push(`Health check failed: ${error.message}`);
  }

  return health;
}

export function logDatabaseHealth(health: DatabaseHealth) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('%c🔍 Leynk Database Health Check', 'font-size: 16px; font-weight: bold; color: #58A9BE;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #58A9BE;');
  
  // Connection Status
  if (health.connected) {
    console.log('%c✅ Connection: SUCCESS', 'color: #58A9BE; font-weight: bold;');
  } else {
    console.log('%c❌ Connection: FAILED', 'color: #dc2626; font-weight: bold;');
  }

  // Tables Status
  console.log('%c📊 Database Tables:', 'color: #374151; font-weight: bold;');
  if (health.tables.users) {
    console.log('  ✅ users table: EXISTS');
  } else {
    console.log('  ❌ users table: MISSING');
    console.log('%c     → Run SQL from SUPABASE_SETUP.md', 'color: #dc2626;');
  }
  if (health.tables.links) {
    console.log('  ✅ links table: EXISTS');
  } else {
    console.log('  ❌ links table: MISSING');
    console.log('%c     → Run SQL from SUPABASE_SETUP.md', 'color: #dc2626;');
  }

  // Storage Status
  console.log('%c📦 Storage Bucket:', 'color: #374151; font-weight: bold;');
  if (health.storage.bucketExists) {
    if (health.storage.bucketPublic) {
      console.log('  ✅ profile-pictures bucket: EXISTS ✅ (Public & Accessible)');
    } else {
      console.log('  ⚠️  profile-pictures bucket: EXISTS ⚠️ (Access issues)');
      console.log('%c     → Check bucket is set to Public in Supabase Storage', 'color: #f59e0b;');
      console.log('%c     → Verify storage policies are set correctly (see setup.sql)', 'color: #f59e0b;');
    }
  } else {
    console.log('  ❌ profile-pictures bucket: NOT ACCESSIBLE');
    console.log('%c     → Create it in Supabase Storage (make it Public)', 'color: #dc2626;');
    console.log('%c     → If it exists, check storage policies allow public access', 'color: #dc2626;');
  }

  // Errors
  if (health.errors.length > 0) {
    console.log('%c⚠️  Issues Found:', 'color: #f59e0b; font-weight: bold;');
    health.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  // Summary
  const allHealthy =
    health.connected &&
    health.tables.users &&
    health.tables.links &&
    health.storage.bucketExists &&
    health.storage.bucketPublic &&
    health.errors.length === 0;

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #58A9BE;');
  
  if (allHealthy) {
    console.log('%c🎉 All systems operational!', 'font-size: 14px; font-weight: bold; color: #58A9BE;');
  } else {
    console.log('%c⚠️  Setup incomplete. Check issues above.', 'font-size: 14px; font-weight: bold; color: #f59e0b;');
    console.log('%c📖 See SUPABASE_SETUP.md for setup instructions', 'color: #6b7280; font-style: italic;');
  }

  console.log(`%cChecked at: ${new Date(health.timestamp).toLocaleString()}`, 'color: #6b7280; font-size: 11px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #58A9BE;');
}

