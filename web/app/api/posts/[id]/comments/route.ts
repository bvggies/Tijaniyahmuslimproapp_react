import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const body = await req.json();
    const { content } = body as { content?: string };

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.communityComment.create({
      data: {
        content,
        postId: params.id,
        userId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/posts/[id]/comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


