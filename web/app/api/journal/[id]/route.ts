import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const body = await req.json();
    const { title, content, tags } = body as {
      title?: string;
      content?: string;
      tags?: string[];
    };

    const existing = await prisma.journalEntry.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.journalEntry.update({
      where: { id: params.id },
      data: {
        title: title ?? existing.title,
        content: content ?? existing.content,
        tags: tags ?? existing.tags,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in PATCH /api/journal/[id]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyAuthHeader(authHeader);

    const existing = await prisma.journalEntry.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    await prisma.journalEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in DELETE /api/journal/[id]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


