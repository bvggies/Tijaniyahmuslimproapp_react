import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { conversationId: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
        participants: { some: { id: userId } },
      },
    });
    if (!conversation) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    await prisma.message.updateMany({
      where: {
        conversationId: params.conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/chat/conversations/[conversationId]/read:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


