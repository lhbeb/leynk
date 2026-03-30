'use client';

import { useEffect, useRef } from 'react';

interface PageViewTrackerProps {
  username: string;
}

export default function PageViewTracker({ username }: PageViewTrackerProps) {
  const hasTracked = useRef(false);
  const currentUsername = useRef<string | null>(null);

  useEffect(() => {
    // Reset tracking state if username changed (user navigated to different page)
    if (currentUsername.current !== username) {
      hasTracked.current = false;
      currentUsername.current = username;
    }

    // Prevent duplicate tracking from React StrictMode double renders
    if (hasTracked.current) {
      return;
    }

    // Mark as tracked immediately to prevent race conditions
    // This prevents double tracking even if useEffect runs twice (StrictMode)
    hasTracked.current = true;

    // Track page view
    const trackPageView = async () => {
      try {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          // If tracking failed, allow retry by clearing the flag
          hasTracked.current = false;
        }
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Failed to track page view:', error);
        // Allow retry on error
        hasTracked.current = false;
      }
    };

    trackPageView();
  }, [username]);

  return null; // This component doesn't render anything
}

