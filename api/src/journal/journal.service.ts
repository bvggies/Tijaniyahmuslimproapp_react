import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, createEntryDto: CreateEntryDto) {
    return this.prisma.journalEntry.create({
      data: {
        userId,
        title: createEntryDto.title,
        content: createEntryDto.content,
        tags: createEntryDto.tags || [],
      },
    });
  }

  async update(id: string, userId: string, updateEntryDto: UpdateEntryDto) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('You can only update your own journal entries');
    }

    return this.prisma.journalEntry.update({
      where: { id },
      data: updateEntryDto,
    });
  }

  async remove(id: string, userId: string) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('You can only delete your own journal entries');
    }

    await this.prisma.journalEntry.delete({
      where: { id },
    });

    return { message: 'Journal entry deleted successfully' };
  }
}
