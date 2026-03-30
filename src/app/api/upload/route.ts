import { NextRequest, NextResponse } from 'next/server';
import { uploadProfilePicture } from '@/lib/storage';
import { normalizeUsername, validateUsername } from '@/lib/username-validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Normalize and validate username
    let normalizedUsername: string;
    try {
      normalizedUsername = normalizeUsername(username);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Invalid username format' },
        { status: 400 }
      );
    }

    const validation = validateUsername(normalizedUsername);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid username format' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const publicUrl = await uploadProfilePicture(file, normalizedUsername);

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

