import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const TIME_24H_REGEX = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

@Injectable()
export class AzanService {
  constructor(private prisma: PrismaService) {}

  private validatePlayAt(playAt: string): void {
    if (!playAt || typeof playAt !== 'string') {
      throw new BadRequestException('playAt is required and must be a string in "HH:mm" format');
    }
    const trimmed = playAt.trim();
    if (!TIME_24H_REGEX.test(trimmed)) {
      throw new BadRequestException('playAt must be in 24h format "HH:mm" (e.g. "05:30")');
    }
  }

  async findAll(params?: { activeOnly?: boolean }) {
    const where: { isActive?: boolean } = {};
    if (params?.activeOnly === true) {
      where.isActive = true;
    }
    const list = await this.prisma.azanSchedule.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return list;
  }

  async findOne(id: string) {
    const item = await this.prisma.azanSchedule.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Azan schedule not found');
    }
    return item;
  }

  async create(data: {
    name: string;
    muezzin?: string;
    location?: string;
    description?: string;
    audioUrl: string;
    playAt: string;
    isActive?: boolean;
    sortOrder?: number;
    createdBy?: string;
  }) {
    if (!data.name || !data.audioUrl || !data.playAt) {
      throw new BadRequestException('name, audioUrl and playAt are required');
    }
    this.validatePlayAt(data.playAt);
    return this.prisma.azanSchedule.create({
      data: {
        name: data.name.trim(),
        muezzin: data.muezzin?.trim() ?? null,
        location: data.location?.trim() ?? null,
        description: data.description?.trim() ?? null,
        audioUrl: data.audioUrl.trim(),
        playAt: data.playAt.trim(),
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdBy: data.createdBy ?? null,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      muezzin?: string;
      location?: string;
      description?: string;
      audioUrl?: string;
      playAt?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    await this.findOne(id);
    if (data.playAt !== undefined) {
      this.validatePlayAt(data.playAt);
    }
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.muezzin !== undefined) payload.muezzin = data.muezzin?.trim() ?? null;
    if (data.location !== undefined) payload.location = data.location?.trim() ?? null;
    if (data.description !== undefined) payload.description = data.description?.trim() ?? null;
    if (data.audioUrl !== undefined) payload.audioUrl = data.audioUrl.trim();
    if (data.playAt !== undefined) payload.playAt = data.playAt.trim();
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return this.prisma.azanSchedule.update({
      where: { id },
      data: payload as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.azanSchedule.delete({ where: { id } });
  }
}
