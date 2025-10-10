import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('posts')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get()
  async listPosts(@Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    try {
      console.log('🔍 CommunityController.listPosts called');
      const result = await this.communityService.listPosts(
        limit ? parseInt(limit) : 20,
        cursor,
      );
      console.log('✅ CommunityController.listPosts returning:', result.data?.length, 'posts');
      return result;
    } catch (error) {
      console.error('❌ Error in CommunityController.listPosts:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.communityService.createPost(req.user.userId, createPostDto);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.communityService.getPost(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Request() req, @Param('id') id: string) {
    return this.communityService.deletePost(id, req.user.userId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(@Request() req, @Param('id') postId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.communityService.addComment(postId, req.user.userId, createCommentDto);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  likePost(@Request() req, @Param('id') postId: string) {
    return this.communityService.likePost(postId, req.user.userId);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  unlikePost(@Request() req, @Param('id') postId: string) {
    return this.communityService.unlikePost(postId, req.user.userId);
  }
}
