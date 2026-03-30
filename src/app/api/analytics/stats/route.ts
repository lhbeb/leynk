import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwevvpdpguhincowygzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZXZ2cGRwZ3VoaW5jb3d5Z3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDg1MTQsImV4cCI6MjA3ODEyNDUxNH0.W-2ECC9vNHaOC0lP8BntGUM4StaseOl-nAwtmCKsxl0';

const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usernames = searchParams.get('usernames');

    if (!usernames) {
      return NextResponse.json(
        { error: 'Usernames parameter is required' },
        { status: 400 }
      );
    }

    const usernameList = usernames.split(',').map((u) => u.trim()).filter(Boolean);

    if (usernameList.length === 0) {
      return NextResponse.json({ stats: {} });
    }

    // Run all per-user COUNT queries in parallel via Promise.all.
    // Using count: 'exact' + head: true means Supabase returns only the COUNT
    // from the DB — zero rows are transferred, so there is NO row/1000 limit.
    // All N queries fire simultaneously, resolving in ~the time of the slowest one.
    const results = await Promise.all(
      usernameList.map((username) =>
        supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .eq('username', username)
          .then(({ count, error }) => ({ username, count: count ?? 0, error }))
      )
    );

    const stats: { [username: string]: number } = {};
    results.forEach(({ username, count, error }) => {
      if (error) {
        console.error(`Error counting views for ${username}:`, error);
        stats[username] = 0;
      } else {
        stats[username] = count;
      }
    });

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Error in analytics stats endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
