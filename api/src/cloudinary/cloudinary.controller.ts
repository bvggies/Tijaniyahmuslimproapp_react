import { Controller, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinarySignature, UploadResult } from './cloudinary.types';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  /**
   * Get a signed upload signature for client-side uploads
   */
  @Post('signature')
  @UseGuards(JwtAuthGuard)
  getUploadSignature(
    @Body() body: { folder?: string; publicId?: string; transformation?: string },
  ): CloudinarySignature {
    return this.cloudinaryService.generateUploadSignature({
      folder: body.folder || 'tijaniyah',
      publicId: body.publicId,
      transformation: body.transformation,
    });
  }

  /**
   * Upload an image from a URL (server-side)
   */
  @Post('url')
  @UseGuards(JwtAuthGuard)
  async uploadFromUrl(@Body() body: { url: string; folder?: string }): Promise<UploadResult> {
    return this.cloudinaryService.uploadFromUrl(body.url, body.folder);
  }

  /**
   * Delete an image
   */
  @Delete(':publicId')
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Param('publicId') publicId: string): Promise<{ success: boolean; error?: string }> {
    return this.cloudinaryService.deleteImage(publicId);
  }
}

