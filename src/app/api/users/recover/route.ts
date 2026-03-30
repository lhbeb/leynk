import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { recoverUser } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Recover a deleted user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username } = body;

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const recovered = await recoverUser(username);

        if (!recovered) {
            return NextResponse.json({ error: 'Failed to recover user' }, { status: 500 });
        }

        // Revalidate pages
        revalidatePath(`/${username}`);
        revalidatePath('/admin');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recovering user:', error);
        return NextResponse.json({ error: 'Failed to recover user' }, { status: 500 });
    }
}
