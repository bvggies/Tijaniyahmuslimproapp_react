import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { otherUserId: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    if (userId === params.otherUserId) {
      return NextResponse.json({ message: 'Cannot create conversation with yourself' }, { status: 400 });
    }

    // Find existing conversation with both participants
    const existing = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            id: { in: [userId, params.otherUserId] },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: userId }, { id: params.otherUserId }],
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/chat/conversations/[otherUserId]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


