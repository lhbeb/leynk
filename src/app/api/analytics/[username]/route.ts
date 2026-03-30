import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwevvpdpguhincowygzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZXZ2cGRwZ3VoaW5jb3d5Z3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDg1MTQsImV4cCI6MjA3ODEyNDUxNH0.W-2ECC9vNHaOC0lP8BntGUM4StaseOl-nAwtmCKsxl0';

const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Run all three queries in parallel — no sequential waterfall
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalResult, countryResult, recentResult, dailyResult] = await Promise.all([
      // 1. Total views count — uses DB count, no rows transferred
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('username', username),

      // 2. Country breakdown — fetch only needed columns, single query (no while-loop)
      //    Capped at 5000 rows which is more than enough per user
      supabase
        .from('page_views')
        .select('country, country_code')
        .eq('username', username)
        .limit(5000),

      // 3. Recent views (last 30 days, latest 100)
      supabase
        .from('page_views')
        .select('*')
        .eq('username', username)
        .gte('viewed_at', thirtyDaysAgo.toISOString())
        .order('viewed_at', { ascending: false })
        .limit(100),

      // 4. Daily views for chart (last 7 days) — only viewed_at column needed
      supabase
        .from('page_views')
        .select('viewed_at')
        .eq('username', username)
        .gte('viewed_at', sevenDaysAgo.toISOString())
        .limit(5000),
    ]);

    // Handle total count
    if (totalResult.error) {
      console.error('Error counting views:', totalResult.error);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Aggregate country stats in JS
    const countryStats: { [key: string]: { country: string; code: string; count: number } } = {};
    countryResult.data?.forEach((view) => {
      const key = view.country_code || 'UN';
      if (!countryStats[key]) {
        countryStats[key] = {
          country: view.country || 'Unknown',
          code: view.country_code || 'UN',
          count: 0,
        };
      }
      countryStats[key].count++;
    });

    // Aggregate daily stats in JS
    const dailyStats: { [key: string]: number } = {};
    dailyResult.data?.forEach((view) => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return NextResponse.json({
      username,
      totalViews: totalResult.count || 0,
      countries: Object.values(countryStats).sort((a, b) => b.count - a.count),
      recentViews: recentResult.data || [],
      dailyStats,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
