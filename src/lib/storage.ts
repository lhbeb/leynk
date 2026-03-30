import { supabase, PROFILE_PICTURES_BUCKET } from './supabase';
import { UserPage, Link } from '@/types';

// Upload profile picture to Supabase storage
export async function uploadProfilePicture(file: File, username: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${username}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
}

// Delete profile picture from storage
export async function deleteProfilePicture(pictureUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(pictureUrl);
    const pathParts = url.pathname.split(`${PROFILE_PICTURES_BUCKET}/`);
    if (pathParts.length < 2) return false;

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return false;
  }
}

// Get all active users with their links (excludes deleted users)
export async function readUsers(): Promise<UserPage[]> {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        links (*)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error reading users:', usersError);
      return [];
    }

    return users.map((user: any) => ({
      username: user.username,
      profilePicture: user.profile_picture || '',
      bio: user.bio || '',
      links: (user.links || [])
        .map((link: any) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          order: link.order_index,
        }))
        .sort((a: Link, b: Link) => a.order - b.order),
      listedBy: user.listed_by || null,
      theme: user.theme || 'standard',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      deletedAt: user.deleted_at,
    }));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Get a single user by username
export async function getUser(username: string): Promise<UserPage | null> {
  try {
    if (!username || username.trim() === '') {
      return null;
    }

    // Fetch user with links, ordered by order_index
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        links (
          id,
          title,
          url,
          order_index,
          created_at
        )
      `)
      .eq('username', username.trim())
      .single();

    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }

    if (!user) {
      return null;
    }

    // Check if user is deleted - return null for deleted users
    if (user.deleted_at) {
      console.log(`User ${username} is deleted`);
      return null;
    }

    // Ensure username exists and is valid
    if (!user.username || typeof user.username !== 'string') {
      console.error('Invalid user data: username is missing or invalid', user);
      return null;
    }

    // Process links with proper ordering
    const processedLinks = Array.isArray(user.links)
      ? user.links
        .map((link: any) => ({
          id: link.id || '',
          title: link.title || '',
          url: link.url || '',
          order: typeof link.order_index === 'number' ? link.order_index : 0,
        }))
        .filter((link: Link) => link.id && link.title && link.url)
        .sort((a: Link, b: Link) => a.order - b.order)
      : [];

    console.log(`[getUser] Fetched user ${username} with ${processedLinks.length} links`);

    return {
      username: user.username,
      profilePicture: user.profile_picture || '',
      bio: user.bio || '',
      links: processedLinks,
      listedBy: user.listed_by || null,
      theme: user.theme || 'standard',
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: user.updated_at || new Date().toISOString(),
      deletedAt: user.deleted_at,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Save or update a user
export async function saveUser(
  username: string,
  userData: {
    profilePicture: string;
    bio: string;
    links: Link[];
    listedBy?: string | null;
    theme?: string;
  }
): Promise<UserPage | null> {
  try {
    // Filter out invalid links before processing
    const validLinks = userData.links.filter(
      (link) => link.title && link.title.trim() && link.url && link.url.trim()
    );

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle(); // Use maybeSingle() to handle not found gracefully

    // If there's a real error (not just "not found"), throw it
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" in Supabase
      console.error('Error checking if user exists:', checkError);
      throw new Error(`Failed to check user existence: ${checkError.message}`);
    }

    let userId: string;

    if (existingUser) {
      // Update existing user
      const updateData: any = {
        profile_picture: userData.profilePicture || null,
        bio: userData.bio || null,
        updated_at: new Date().toISOString(),
      };

      // Only update listed_by if provided
      if (userData.listedBy !== undefined) {
        updateData.listed_by = userData.listedBy || null;
      }

      // Update theme if provided
      if (userData.theme) {
        updateData.theme = userData.theme;
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('username', username)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw new Error(`Failed to update user: ${updateError.message}`);
      }

      if (!updatedUser) {
        throw new Error('User update returned no data');
      }

      userId = updatedUser.id;

      // Delete existing links first
      const { error: deleteError } = await supabase
        .from('links')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting existing links:', deleteError);
        // Don't throw here - we'll try to insert anyway
      }
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          username,
          profile_picture: userData.profilePicture || null,
          bio: userData.bio || null,
          listed_by: userData.listedBy || null,
          theme: userData.theme || 'standard',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw new Error(`Failed to create user: ${insertError.message}`);
      }

      if (!newUser) {
        throw new Error('User creation returned no data');
      }

      userId = newUser.id;
    }

    // Insert new links if there are any valid ones
    if (validLinks.length > 0) {
      const linksToInsert = validLinks.map((link, index) => ({
        user_id: userId,
        title: link.title.trim(),
        url: link.url.trim(),
        order_index: typeof link.order === 'number' ? link.order : index,
      }));

      console.log('Inserting links:', linksToInsert.length, linksToInsert);

      const { data: insertedLinks, error: linksError } = await supabase
        .from('links')
        .insert(linksToInsert)
        .select();

      if (linksError) {
        console.error('Error inserting links:', linksError);
        console.error('Links that failed to insert:', linksToInsert);
        console.error('Full error details:', JSON.stringify(linksError, null, 2));
        throw new Error(`Failed to save links: ${linksError.message}`);
      }

      if (!insertedLinks) {
        console.error('No links returned from insert operation');
        throw new Error('Failed to save links: No data returned');
      }

      if (insertedLinks.length !== validLinks.length) {
        console.warn('Not all links were inserted:', {
          expected: validLinks.length,
          inserted: insertedLinks.length,
        });
      } else {
        console.log('Successfully inserted', insertedLinks.length, 'links');
        console.log('Inserted links data:', JSON.stringify(insertedLinks, null, 2));
      }
    } else {
      console.log('No valid links to insert for user:', username);
    }

    // Small delay to ensure database operations are committed
    await new Promise(resolve => setTimeout(resolve, 200));

    // Fetch and return the complete user data to verify it was saved
    // Use a fresh query to ensure we get the latest data
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select(`
        *,
        links (
          id,
          title,
          url,
          order_index,
          created_at
        )
      `)
      .eq('username', username)
      .single();

    if (verifyError) {
      console.error('Error verifying saved user:', verifyError);
      // Still try to use getUser as fallback
      const savedUser = await getUser(username);
      if (savedUser) {
        return savedUser;
      }
      throw new Error('Failed to retrieve saved user data');
    }

    if (!verifyUser) {
      throw new Error('Failed to retrieve saved user data');
    }

    // Process the verified user data
    const processedLinks = Array.isArray(verifyUser.links)
      ? verifyUser.links
        .map((link: any) => ({
          id: link.id || '',
          title: link.title || '',
          url: link.url || '',
          order: typeof link.order_index === 'number' ? link.order_index : 0,
        }))
        .filter((link: Link) => link.id && link.title && link.url)
        .sort((a: Link, b: Link) => a.order - b.order)
      : [];

    console.log('✅ Verified saved user with', processedLinks.length, 'links:', processedLinks.map((l: Link) => l.title));

    const savedUser: UserPage = {
      username: verifyUser.username,
      profilePicture: verifyUser.profile_picture || '',
      bio: verifyUser.bio || '',
      links: processedLinks,
      createdAt: verifyUser.created_at || new Date().toISOString(),
      updatedAt: verifyUser.updated_at || new Date().toISOString(),
    };

    return savedUser;
  } catch (error: any) {
    console.error('Error saving user:', error);
    throw error; // Re-throw so API can handle it
  }
}

// Delete a user
export async function deleteUser(username: string): Promise<boolean> {
  try {
    // Get user to find profile picture
    const user = await getUser(username);

    // Soft delete: set deleted_at timestamp instead of actually deleting
    const { error } = await supabase
      .from('users')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('username', username);

    if (error) {
      console.error('Error soft deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error soft deleting user:', error);
    return false;
  }
}

// Get all deleted users with their links
export async function getDeletedUsers(): Promise<UserPage[]> {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        links (*)
      `)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (usersError) {
      console.error('Error reading deleted users:', usersError);
      return [];
    }

    return users.map((user: any) => ({
      username: user.username,
      profilePicture: user.profile_picture || '',
      bio: user.bio || '',
      links: (user.links || [])
        .map((link: any) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          order: link.order_index,
        }))
        .sort((a: Link, b: Link) => a.order - b.order),
      listedBy: user.listed_by || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      deletedAt: user.deleted_at,
    }));
  } catch (error) {
    console.error('Error reading deleted users:', error);
    return [];
  }
}

// Recover a deleted user (undelete)
export async function recoverUser(username: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        deleted_at: null,
      })
      .eq('username', username);

    if (error) {
      console.error('Error recovering user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recovering user:', error);
    return false;
  }
}

// Permanently delete a user (hard delete)
export async function permanentlyDeleteUser(username: string): Promise<boolean> {
  try {
    // Get user to find profile picture (including deleted users)
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('profile_picture')
      .eq('username', username)
      .single();

    if (getUserError) {
      console.error('Error getting user for permanent deletion:', getUserError);
    }

    // Delete profile picture from storage if it's stored in Supabase
    if (user?.profile_picture && user.profile_picture.includes(PROFILE_PICTURES_BUCKET)) {
      await deleteProfilePicture(user.profile_picture);
    }

    // Permanently delete user (links will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);

    if (error) {
      console.error('Error permanently deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    return false;
  }
}

// Get all usernames
export async function getAllUsernames(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .order('username', { ascending: true });

    if (error) {
      console.error('Error getting usernames:', error);
      return [];
    }

    return data.map((user: any) => user.username);
  } catch (error) {
    console.error('Error getting usernames:', error);
    return [];
  }
}
