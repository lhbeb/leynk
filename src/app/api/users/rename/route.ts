import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { normalizeUsername, validateUsername } from '@/lib/username-validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Rename/change a username
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { oldUsername, newUsername } = body;

        if (!oldUsername || typeof oldUsername !== 'string') {
            return NextResponse.json({ error: 'Old username is required' }, { status: 400 });
        }

        if (!newUsername || typeof newUsername !== 'string') {
            return NextResponse.json({ error: 'New username is required' }, { status: 400 });
        }

        // Normalize and validate new username
        let normalizedNewUsername: string;
        try {
            normalizedNewUsername = normalizeUsername(newUsername);
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message || 'Invalid username format' },
                { status: 400 }
            );
        }

        // Additional validation
        const validation = validateUsername(normalizedNewUsername);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error || 'Invalid username format' },
                { status: 400 }
            );
        }

        // Check if old username exists
        const { data: oldUser, error: oldUserError } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', oldUsername)
            .single();

        if (oldUserError || !oldUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if new username is already taken (case-insensitive)
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('username')
            .ilike('username', normalizedNewUsername)
            .maybeSingle();

        if (existingUser && existingUser.username.toLowerCase() !== oldUsername.toLowerCase()) {
            return NextResponse.json(
                { error: `Username "${normalizedNewUsername}" is already taken` },
                { status: 409 }
            );
        }

        // If the new username is the same as the old one (just different case), allow it
        if (oldUsername.toLowerCase() === normalizedNewUsername.toLowerCase() && oldUsername !== normalizedNewUsername) {
            // Just update the case
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username: normalizedNewUsername,
                    updated_at: new Date().toISOString(),
                })
                .eq('username', oldUsername);

            if (updateError) {
                console.error('Error updating username case:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update username' },
                    { status: 500 }
                );
            }

            // Revalidate paths
            revalidatePath('/admin');
            revalidatePath(`/${oldUsername}`);
            revalidatePath(`/${normalizedNewUsername}`);
            revalidatePath(`/admin/edit/${oldUsername}`);
            revalidatePath(`/admin/edit/${normalizedNewUsername}`);

            return NextResponse.json({
                success: true,
                oldUsername,
                newUsername: normalizedNewUsername,
                message: 'Username updated successfully',
            });
        }

        // Update the username in the database
        // Note: This will automatically update all related records due to CASCADE
        const { error: updateError } = await supabase
            .from('users')
            .update({
                username: normalizedNewUsername,
                updated_at: new Date().toISOString(),
            })
            .eq('username', oldUsername);

        if (updateError) {
            console.error('Error updating username:', updateError);
            return NextResponse.json(
                { error: 'Failed to update username. It may already be taken.' },
                { status: 500 }
            );
        }

        console.log(`✅ Username changed from "${oldUsername}" to "${normalizedNewUsername}"`);

        // Revalidate all relevant paths
        revalidatePath('/admin');
        revalidatePath(`/${oldUsername}`);
        revalidatePath(`/${normalizedNewUsername}`);
        revalidatePath(`/admin/edit/${oldUsername}`);
        revalidatePath(`/admin/edit/${normalizedNewUsername}`);

        return NextResponse.json({
            success: true,
            oldUsername,
            newUsername: normalizedNewUsername,
            message: 'Username changed successfully',
        });
    } catch (error: any) {
        console.error('Error renaming user:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to change username' },
            { status: 500 }
        );
    }
}
