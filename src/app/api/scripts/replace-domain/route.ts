import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromDomain, toDomain, dryRun = false } = body;

    if (!fromDomain || !toDomain) {
      return NextResponse.json(
        { error: 'fromDomain and toDomain are required' },
        { status: 400 }
      );
    }

    // Normalize: strip protocol and www from both domains for matching
    const cleanFrom = fromDomain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
    const cleanTo = toDomain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    // Fetch all links that contain the source domain
    const { data: links, error: fetchError } = await supabase
      .from('links')
      .select('id, url, title, user_id')
      .or(`url.ilike.%${cleanFrom}%,url.ilike.%www.${cleanFrom}%`);

    if (fetchError) {
      console.error('Error fetching links:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch links: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!links || links.length === 0) {
      return NextResponse.json({
        affected: 0,
        dryRun,
        message: `No links found containing "${cleanFrom}"`,
        preview: [],
      });
    }

    // Build preview of changes
    const preview = links.map((link) => {
      // Replace all occurrences of the domain (with/without www, any protocol)
      const newUrl = link.url
        .replace(
          new RegExp(`(https?://)(?:www\\.)?${escapeRegex(cleanFrom)}`, 'gi'),
          (match: string, protocol: string) => `${protocol}${cleanTo}`
        );
      return {
        id: link.id,
        title: link.title,
        oldUrl: link.url,
        newUrl,
        changed: link.url !== newUrl,
      };
    }).filter((item) => item.changed);

    if (preview.length === 0) {
      return NextResponse.json({
        affected: 0,
        dryRun,
        message: `Found ${links.length} links with "${cleanFrom}" but URL construction produced no changes. Check domain format.`,
        preview: [],
      });
    }

    // If dry run, just return the preview
    if (dryRun) {
      return NextResponse.json({
        affected: preview.length,
        dryRun: true,
        message: `Preview: ${preview.length} link(s) would be updated`,
        preview,
      });
    }

    // Execute the updates
    const results = await Promise.allSettled(
      preview.map(async (item) => {
        const { error } = await supabase
          .from('links')
          .update({ url: item.newUrl })
          .eq('id', item.id);

        if (error) throw new Error(`Failed to update link ${item.id}: ${error.message}`);
        return item;
      })
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected');

    return NextResponse.json({
      affected: succeeded,
      failed: failed.length,
      dryRun: false,
      message: `Successfully updated ${succeeded} of ${preview.length} link(s)`,
      preview,
      errors: failed.map((f) => (f as PromiseRejectedResult).reason?.message),
    });
  } catch (error: any) {
    console.error('Script error:', error);
    return NextResponse.json(
      { error: error.message || 'Script execution failed' },
      { status: 500 }
    );
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
