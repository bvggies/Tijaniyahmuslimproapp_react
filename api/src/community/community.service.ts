import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async listPosts(limit = 20, cursor?: string) {
    try {
      console.log('🔍 CommunityService.listPosts called with limit:', limit, 'cursor:', cursor);
      
      const posts = await this.prisma.communityPost.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          likes: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      });

      console.log('✅ Found posts:', posts.length);

      const hasNextPage = posts.length > limit;
      const nextCursor = hasNextPage ? posts[limit - 1].id : null;
      const data = hasNextPage ? posts.slice(0, -1) : posts;

      return {
        data,
        nextCursor,
        hasNextPage,
      };
    } catch (error) {
      console.error('❌ Error in listPosts:', error);
      throw error;
    }
  }

  async createPost(userId: string, createPostDto: CreatePostDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const post = await this.prisma.communityPost.create({
      data: {
        userId,
        content: createPostDto.content,
        mediaUrls: createPostDto.mediaUrls || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        comments: true,
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return post;
  }

  async getPost(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.communityPost.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async addComment(postId: string, userId: string, createCommentDto: CreateCommentDto) {
    const comment = await this.prisma.communityComment.create({
      data: {
        postId,
        userId,
        content: createCommentDto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return comment;
  }

  async likePost(postId: string, userId: string) {
    const existingLike = await this.prisma.communityLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      return { message: 'Post already liked' };
    }

    await this.prisma.communityLike.create({
      data: {
        postId,
        userId,
      },
    });

    return { message: 'Post liked successfully' };
  }

  async unlikePost(postId: string, userId: string) {
    const existingLike = await this.prisma.communityLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!existingLike) {
      return { message: 'Post not liked' };
    }

    await this.prisma.communityLike.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return { message: 'Post unliked successfully' };
  }
}
