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

    const like = await prisma.communityLike.upsert({
      where: {
        postId_userId: {
          postId: params.id,
          userId,
        },
      },
      update: {},
      create: {
        postId: params.id,
        userId,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/posts/[id]/like:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    await prisma.communityLike.deleteMany({
      where: {
        postId: params.id,
        userId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in DELETE /api/posts/[id]/like:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


