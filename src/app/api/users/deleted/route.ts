import { NextResponse } from 'next/server';
import { getDeletedUsers } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all deleted users
export async function GET() {
    try {
        const users = await getDeletedUsers();
        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching deleted users:', error);
        return NextResponse.json({ error: 'Failed to fetch deleted users' }, { status: 500 });
    }
}
