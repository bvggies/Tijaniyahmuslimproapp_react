import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(
    @Request() req,
    @Body() body: { message: string; conversationHistory?: Array<{ role: string; content: string }> },
  ) {
    return this.aiService.chat(req.user.userId, body.message, body.conversationHistory || []);
  }
}

