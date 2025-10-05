import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, data: { title: string; content: string; tags?: string[] }) {
    return this.prisma.journalEntry.create({ data: { userId, title: data.title, content: data.content, tags: data.tags || [] } });
  }

  async update(userId: string, id: string, data: { title?: string; content?: string; tags?: string[] }) {
    const entry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException();
    if (entry.userId !== userId) throw new ForbiddenException();
    return this.prisma.journalEntry.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    const entry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException();
    if (entry.userId !== userId) throw new ForbiddenException();
    await this.prisma.journalEntry.delete({ where: { id } });
    return { ok: true };
  }
}