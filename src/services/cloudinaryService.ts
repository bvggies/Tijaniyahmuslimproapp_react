import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dplvxodnd',
  apiKey: '373862586681547',
  apiSecret: 'Ca4ClORTAdJA8-626EcAhD5CYSg',
};

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

class CloudinaryService {
  private static instance: CloudinaryService;

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Generate SHA-1 signature for Cloudinary signed uploads
   */
  private async generateSignature(params: Record<string, string>): Promise<string> {
    // Sort parameters alphabetically and create signature string
    const sortedKeys = Object.keys(params).sort();
    const signatureString = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&') + CLOUDINARY_CONFIG.apiSecret;
    
    // Generate SHA-1 hash
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      signatureString
    );
    
    return hash;
  }

  /**
   * Upload an image to Cloudinary using signed uploads (no preset required)
   * @param localUri - The local file URI (from ImagePicker)
   * @param options - Upload options
   */
  async uploadImage(localUri: string, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const { folder = 'tijaniyah', resourceType = 'image' } = options;

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        return { success: false, error: 'File does not exist' };
      }

      // Determine file extension and MIME type
      const uriParts = localUri.split('.');
      const fileType = uriParts[uriParts.length - 1] || 'jpg';
      const mimeType = this.getMimeType(fileType);

      // Generate timestamp for signature
      const timestamp = Math.floor(Date.now() / 1000).toString();

      // Parameters for signature (must be alphabetically sorted)
      const signatureParams: Record<string, string> = {
        folder,
        timestamp,
      };

      // Generate signature
      const signature = await this.generateSignature(signatureParams);

      // Create form data for upload
      const formData = new FormData();
      
      // Append the file
      const file = {
        uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri,
        type: mimeType,
        name: `upload_${Date.now()}.${fileType}`,
      } as any;
      
      formData.append('file', file);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
      
      console.log('📤 Uploading to Cloudinary (signed)...');

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (result.error) {
        console.error('❌ Cloudinary error:', result.error);
        return { success: false, error: result.error.message || 'Upload failed' };
      }

      console.log('✅ Upload successful:', result.secure_url);

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('❌ Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Upload a profile picture with optimized settings
   */
  async uploadProfilePicture(localUri: string): Promise<UploadResult> {
    return this.uploadImage(localUri, {
      folder: 'tijaniyah/profiles',
    });
  }

  /**
   * Upload a post image with optimized settings
   */
  async uploadPostImage(localUri: string): Promise<UploadResult> {
    return this.uploadImage(localUri, {
      folder: 'tijaniyah/posts',
    });
  }

  /**
   * Upload multiple images (for posts with multiple images)
   */
  async uploadMultipleImages(localUris: string[], folder = 'tijaniyah/posts'): Promise<UploadResult[]> {
    const results = await Promise.all(
      localUris.map((uri) => this.uploadImage(uri, { folder }))
    );
    return results;
  }

  /**
   * Get optimized URL with transformations
   */
  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}): string {
    const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
    
    let transformation = `q_${quality},f_${format}`;
    if (width) transformation += `,w_${width}`;
    if (height) transformation += `,h_${height}`;
    if (crop) transformation += `,c_${crop}`;

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  /**
   * Get thumbnail URL for profile pictures
   */
  getProfileThumbnail(url: string, size = 100): string {
    if (!url || !url.includes('cloudinary')) return url;
    
    // Insert transformation before the public ID
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    
    const beforeUpload = url.substring(0, uploadIndex + 8);
    const afterUpload = url.substring(uploadIndex + 8);
    
    return `${beforeUpload}c_fill,w_${size},h_${size},g_face,q_auto/${afterUpload}`;
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      const signatureParams: Record<string, string> = {
        public_id: publicId,
        timestamp,
      };
      
      const signature = await this.generateSignature(signatureParams);
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const result = await response.json();
      
      if (result.result === 'ok') {
        return { success: true };
      }
      
      return { success: false, error: result.error?.message || 'Delete failed' };
    } catch (error) {
      console.error('❌ Delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      heic: 'image/heic',
      heif: 'image/heif',
    };
    return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
  }
}

export default CloudinaryService;

// Export config for backend use
export const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.cloudName;
