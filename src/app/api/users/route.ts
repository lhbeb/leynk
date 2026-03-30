import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readUsers, saveUser, deleteUser } from '@/lib/storage';
import { normalizeUsername, validateUsername } from '@/lib/username-validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all users
export async function GET() {
  try {
    const users = await readUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Create or update a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, profilePicture, bio, links, listedBy, theme } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Normalize and validate username (server-side validation)
    let normalizedUsername: string;
    try {
      normalizedUsername = normalizeUsername(username);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Invalid username format' },
        { status: 400 }
      );
    }

    // Additional validation
    const validation = validateUsername(normalizedUsername);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid username format' },
        { status: 400 }
      );
    }

    // Validate and filter links
    const validLinks = Array.isArray(links)
      ? links.filter((link: any) => {
        return (
          link &&
          typeof link.title === 'string' &&
          link.title.trim() &&
          typeof link.url === 'string' &&
          link.url.trim()
        );
      })
      : [];

    const userData = {
      profilePicture: profilePicture || '',
      bio: bio || '',
      links: validLinks,
      listedBy: listedBy || null,
      theme: theme || 'standard',
    };

    console.log('Saving user:', normalizedUsername, 'with', validLinks.length, 'links');

    const savedUser = await saveUser(normalizedUsername, userData);

    if (!savedUser) {
      return NextResponse.json(
        { error: 'Failed to save user. Check server logs for details.' },
        { status: 500 }
      );
    }

    console.log('User saved successfully:', normalizedUsername, 'Links count:', savedUser.links.length);

    // Revalidate the user page and admin pages to show updated data
    revalidatePath(`/${normalizedUsername}`);
    revalidatePath('/admin');
    revalidatePath(`/admin/edit/${normalizedUsername}`);

    return NextResponse.json({ user: savedUser });
  } catch (error: any) {
    console.error('Error saving user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save user' },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const deleted = await deleteUser(username);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

