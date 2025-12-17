import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { conversationId: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
        participants: { some: { id: userId } },
      },
    });
    if (!conversation) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: params.conversationId },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: string | null = null;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return NextResponse.json({
      data: messages,
      cursor: nextCursor,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in GET /api/chat/conversations/[conversationId]/messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const body = await req.json();
    const { content, messageType } = body as {
      content?: string;
      messageType?: string;
    };

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
        participants: { some: { id: userId } },
      },
    });
    if (!conversation) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        messageType: messageType ?? 'text',
        conversationId: params.conversationId,
        senderId: userId,
      },
    });

    await prisma.conversation.update({
      where: { id: params.conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/chat/conversations/[conversationId]/messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


