import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth/service';

/**
 * Admin-only file upload endpoint for brand assets
 * Handles OG images, favicons, and app icons
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!fileType) {
      return NextResponse.json({ error: 'No file type specified' }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      'og-image',
      'favicon',
      'favicon-16',
      'favicon-32',
      'apple-touch-icon',
    ];

    if (!validTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Get file extension
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine filename based on type
    let filename: string;
    switch (fileType) {
      case 'og-image':
        filename = 'og-image.png';
        break;
      case 'favicon':
        filename = 'favicon.ico';
        break;
      case 'favicon-16':
        filename = 'favicon-16.png';
        break;
      case 'favicon-32':
        filename = 'favicon-32.png';
        break;
      case 'apple-touch-icon':
        filename = 'apple-touch-icon.png';
        break;
      default:
        return NextResponse.json({ error: 'Unknown file type' }, { status: 400 });
    }

    // Validate file size (max 5MB for images)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB.' },
        { status: 400 }
      );
    }

    // Write file to public directory
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filename,
      url: `/${filename}`,
      size: buffer.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
