import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { permanentlyDeleteUser } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Permanently delete a user (hard delete)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const deleted = await permanentlyDeleteUser(username);

        if (!deleted) {
            return NextResponse.json({ error: 'User not found or failed to delete' }, { status: 404 });
        }

        // Revalidate admin page
        revalidatePath('/admin');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error permanently deleting user:', error);
        return NextResponse.json({ error: 'Failed to permanently delete user' }, { status: 500 });
    }
}
