import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check JWT authentication
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.user?.sub;

    if (!userId) {
      throw new ForbiddenException('User ID not found in token');
    }

    // Check if user has admin role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const adminRoles = ['ADMIN', 'MODERATOR'];
    if (!adminRoles.includes(user.role)) {
      throw new ForbiddenException('Admin privileges required');
    }

    return true;
  }
}

