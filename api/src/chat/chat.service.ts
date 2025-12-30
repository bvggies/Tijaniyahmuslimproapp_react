import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map(conv => ({
      id: conv.id,
      participants: conv.participants.filter(p => p.id !== userId),
      lastMessage: conv.messages[0] || null,
      unreadCount: conv._count.messages,
      updatedAt: conv.updatedAt,
    }));
  }

  async getOrCreateConversation(userId: string, otherUserId: string) {
    // Check if conversation already exists
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            id: {
              in: [userId, otherUserId],
            },
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!conversation) {
      // Create new conversation
      conversation = await this.prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: userId },
              { id: otherUserId },
            ],
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return conversation;
  }

  async getMessages(conversationId: string, userId: string, limit = 50, cursor?: string) {
    // Verify user is participant
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!conversation) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = messages.length > limit;
    const nextCursor = hasNextPage ? messages[limit - 1].id : null;
    const data = hasNextPage ? messages.slice(0, -1) : messages;

    return {
      data: data.reverse(), // Return in chronological order
      nextCursor,
      hasNextPage,
    };
  }

  async sendMessage(userId: string, conversationId: string, createMessageDto: CreateMessageDto) {
    // Verify user is participant and get all participants
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: { id: true },
        },
      },
    });

    if (!conversation) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: createMessageDto.content,
        messageType: createMessageDto.messageType || 'text',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Send notification to other participants
    const otherParticipants = conversation.participants
      .filter(p => p.id !== userId)
      .map(p => p.id);

    for (const recipientId of otherParticipants) {
      this.notificationsService.notifyNewMessage(
        conversationId,
        recipientId,
        userId,
        message.sender.name || message.sender.email,
        createMessageDto.content,
      ).catch(err => console.error('Failed to send message notification:', err));
    }

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
