import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 100); // Max 100 per page
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search by email or name
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    // Filter by role
    if (params.role && params.role !== 'all') {
      where.role = params.role as UserRole;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          posts: {
            select: { id: true },
          },
          journals: {
            select: { id: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Transform to match admin dashboard User interface
    const transformedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name || '',
      avatarUrl: user.avatarUrl || undefined,
      role: user.role,
      isActive: true, // Default to true, can be extended later
      emailVerified: true, // Default to true, can be extended later
      tier: 'free' as const, // Default tier
      isPremium: false, // Default premium status
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: undefined,
      lastActiveAt: undefined,
      notificationsEnabled: true,
      streakCount: 0,
      totalPrayers: 0,
      donationsTotal: 0,
    }));

    // Return in format expected by admin dashboard (PaginatedResponse)
    return {
      data: transformedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: { id: true },
        },
        journals: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      avatarUrl: user.avatarUrl || undefined,
      role: user.role,
      isActive: true,
      emailVerified: true,
      tier: 'free' as const,
      isPremium: false,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: undefined,
      lastActiveAt: undefined,
      notificationsEnabled: true,
      streakCount: 0,
      totalPrayers: 0,
      donationsTotal: 0,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name || '',
      avatarUrl: updated.avatarUrl || undefined,
      role: updated.role,
      isActive: true,
      emailVerified: true,
      tier: 'free' as const,
      isPremium: false,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      lastLoginAt: undefined,
      lastActiveAt: undefined,
      notificationsEnabled: true,
      streakCount: 0,
      totalPrayers: 0,
      donationsTotal: 0,
    };
  }

  async updateRole(id: string, updateRoleDto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: updateRoleDto.role },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name || '',
      avatarUrl: updated.avatarUrl || undefined,
      role: updated.role,
      isActive: true,
      emailVerified: true,
      tier: 'free' as const,
      isPremium: false,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      lastLoginAt: undefined,
      lastActiveAt: undefined,
      notificationsEnabled: true,
      streakCount: 0,
      totalPrayers: 0,
      donationsTotal: 0,
    };
  }

  async activate(id: string) {
    // For now, activation is just updating the user
    // In the future, you can add an isActive field to the User model
    return this.findOne(id);
  }

  async deactivate(id: string) {
    // For now, deactivation is just updating the user
    // In the future, you can add an isActive field to the User model
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting yourself
    // This will be checked in the controller with the request user

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}

