import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.userId);
  }

  @Post('conversations/:otherUserId')
  @UseGuards(JwtAuthGuard)
  getOrCreateConversation(@Request() req, @Param('otherUserId') otherUserId: string) {
    return this.chatService.getOrCreateConversation(req.user.userId, otherUserId);
  }

  @Get('conversations/:conversationId/messages')
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.chatService.getMessages(
      conversationId,
      req.user.userId,
      limit ? parseInt(limit) : 50,
      cursor,
    );
  }

  @Post('conversations/:conversationId/messages')
  @UseGuards(JwtAuthGuard)
  sendMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.userId, conversationId, createMessageDto);
  }

  @Post('conversations/:conversationId/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Request() req, @Param('conversationId') conversationId: string) {
    return this.chatService.markAsRead(conversationId, req.user.userId);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadMessageCount(@Request() req) {
    return this.chatService.getUnreadMessageCount(req.user.userId);
  }
}
