'use client';

import { useEffect } from 'react';
import { checkDatabaseHealth, logDatabaseHealth } from '@/lib/db-health';

export default function DevTools() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Wait a bit for the app to load
    const timer = setTimeout(async () => {
      try {
        console.log('%c🚀 Leynk Dev Tools', 'font-size: 18px; font-weight: bold; color: #58A9BE; padding: 10px 0;');
        
        const health = await checkDatabaseHealth();
        logDatabaseHealth(health);

        // Also log raw data for debugging
        console.group('%c🔧 Debug Info', 'color: #6b7280; font-weight: bold;');
        console.log('Raw health data:', health);
        console.log('Supabase URL: Hardcoded in src/lib/supabase.ts');
        console.log('Project: rwevvpdpguhincowygzx');
        console.groupEnd();
      } catch (error: any) {
        console.error('%c❌ Dev Tools Error:', 'color: #dc2626; font-weight: bold;', error);
        console.log('%cFailed to run database health check', 'color: #f59e0b;');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}

