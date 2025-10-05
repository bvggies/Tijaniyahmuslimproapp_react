import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('posts')
export class CommunityController {
  constructor(private svc: CommunityService) {}

  @Get()
  list(@Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    return this.svc.listPosts(limit ? Number(limit) : 20, cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreatePostDto) {
    return this.svc.createPost(req.user.userId, dto.content, dto.mediaUrls || []);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.getPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.deletePost(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  comment(@Req() req: any, @Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.svc.addComment(id, req.user.userId, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Req() req: any, @Param('id') id: string) {
    return this.svc.like(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Req() req: any, @Param('id') id: string) {
    return this.svc.unlike(id, req.user.userId);
  }
}