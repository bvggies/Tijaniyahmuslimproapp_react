import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async listPosts(limit = 20, cursor?: string) {
    const posts = await this.prisma.communityPost.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } }, _count: { select: { comments: true, likes: true } } },
    });
    let nextCursor: string | undefined;
    if (posts.length > limit) { nextCursor = posts.pop()!.id; }
    return { items: posts, nextCursor };
  }

  async createPost(userId: string, content: string, mediaUrls: string[] = []) {
    return this.prisma.communityPost.create({ data: { userId, content, mediaUrls } });
  }

  async getPost(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: { user: true, comments: { orderBy: { createdAt: 'asc' }, include: { user: true } }, _count: { select: { likes: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.userId !== userId) throw new ForbiddenException();
    await this.prisma.communityPost.delete({ where: { id } });
    return { ok: true };
  }

  async addComment(postId: string, userId: string, content: string) {
    await this.ensurePost(postId);
    return this.prisma.communityComment.create({ data: { postId, userId, content } });
  }

  async like(postId: string, userId: string) {
    await this.ensurePost(postId);
    await this.prisma.communityLike.create({ data: { postId, userId } }).catch(() => {});
    return { ok: true };
  }

  async unlike(postId: string, userId: string) {
    await this.ensurePost(postId);
    await this.prisma.communityLike.deleteMany({ where: { postId, userId } });
    return { ok: true };
  }

  private async ensurePost(postId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
  }
}