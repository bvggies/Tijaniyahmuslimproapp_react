import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: true },
        },
        likes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const post = await prisma.communityPost.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    if (post.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in DELETE /api/posts/[id]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


