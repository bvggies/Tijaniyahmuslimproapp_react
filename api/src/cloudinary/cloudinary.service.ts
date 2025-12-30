import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private configService: ConfigService) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'dplvxodnd';
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || '373862586681547';
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || 'Ca4ClORTAdJA8-626EcAhD5CYSg';
  }

  /**
   * Generate a signature for signed uploads from the client
   */
  generateUploadSignature(params: {
    folder?: string;
    publicId?: string;
    transformation?: string;
  }): CloudinarySignature {
    const timestamp = Math.round(Date.now() / 1000);
    
    // Build the string to sign
    const paramsToSign: Record<string, string | number> = {
      timestamp,
    };
    
    if (params.folder) paramsToSign.folder = params.folder;
    if (params.publicId) paramsToSign.public_id = params.publicId;
    if (params.transformation) paramsToSign.transformation = params.transformation;
    
    // Sort and stringify
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    // Generate signature using SHA-1
    const crypto = require('crypto');
    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + this.apiSecret)
      .digest('hex');
    
    return {
      signature,
      timestamp,
      cloudName: this.cloudName,
      apiKey: this.apiKey,
    };
  }

  /**
   * Upload an image from a URL (for server-side uploads)
   */
  async uploadFromUrl(imageUrl: string, folder = 'tijaniyah'): Promise<UploadResult> {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      
      const crypto = require('crypto');
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + this.apiSecret)
        .digest('hex');

      const formData = new URLSearchParams();
      formData.append('file', imageUrl);
      formData.append('folder', folder);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.apiKey);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.error) {
        this.logger.error('Cloudinary upload error:', result.error);
        return { success: false, error: result.error.message };
      }

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      this.logger.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
      
      const crypto = require('crypto');
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + this.apiSecret)
        .digest('hex');

      const formData = new URLSearchParams();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.apiKey);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.result === 'ok') {
        return { success: true };
      }

      return { success: false, error: result.result || 'Delete failed' };
    } catch (error) {
      this.logger.error('Delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: string;
    format?: string;
  } = {}): string {
    const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
    
    let transformation = `q_${quality},f_${format}`;
    if (width) transformation += `,w_${width}`;
    if (height) transformation += `,h_${height}`;
    if (crop) transformation += `,c_${crop}`;

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }
}

