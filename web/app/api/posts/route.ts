import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const posts = await prisma.communityPost.findMany({
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return NextResponse.json({
      data: posts,
      cursor: nextCursor,
    });
  } catch (error: any) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const body = await req.json();
    const { content, mediaUrls } = body as { content?: string; mediaUrls?: string[] };

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        content,
        mediaUrls: mediaUrls ?? [],
        userId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


