import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dplvxodnd',
  uploadPreset: 'tijaniyah_unsigned', // We'll use unsigned uploads for mobile
  apiKey: '373862586681547',
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
   * Upload an image to Cloudinary from a local URI
   * @param localUri - The local file URI (from ImagePicker)
   * @param options - Upload options
   */
  async uploadImage(localUri: string, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const { folder = 'tijaniyah', transformation, resourceType = 'image' } = options;

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        return { success: false, error: 'File does not exist' };
      }

      // Determine file extension and MIME type
      const uriParts = localUri.split('.');
      const fileType = uriParts[uriParts.length - 1] || 'jpg';
      const mimeType = this.getMimeType(fileType);

      // Create form data for upload
      const formData = new FormData();
      
      // Append the file
      const file = {
        uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri,
        type: mimeType,
        name: `upload_${Date.now()}.${fileType}`,
      } as any;
      
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
      formData.append('folder', folder);
      
      if (transformation) {
        formData.append('transformation', transformation);
      }

      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
      
      console.log('📤 Uploading to Cloudinary...', uploadUrl);

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
      transformation: 'c_fill,w_400,h_400,g_face,q_auto:good,f_auto',
    });
  }

  /**
   * Upload a post image with optimized settings
   */
  async uploadPostImage(localUri: string): Promise<UploadResult> {
    return this.uploadImage(localUri, {
      folder: 'tijaniyah/posts',
      transformation: 'c_limit,w_1200,h_1200,q_auto:good,f_auto',
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
   * Delete an image from Cloudinary (requires backend support)
   */
  async deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
    // Note: Direct deletion from client requires signed uploads
    // This should be done through the backend
    console.log('Delete image:', publicId, '- This should be handled by the backend');
    return { success: true };
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

