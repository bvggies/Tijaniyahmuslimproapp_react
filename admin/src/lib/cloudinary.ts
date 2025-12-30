// Cloudinary Configuration for Admin Dashboard
const CLOUDINARY_CONFIG = {
  cloudName: 'dplvxodnd',
  uploadPreset: 'tijaniyah_unsigned',
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
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const { folder = 'tijaniyah/admin' } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.error) {
      console.error('Cloudinary error:', result.error);
      return { success: false, error: result.error.message || 'Upload failed' };
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder = 'tijaniyah/admin'
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadToCloudinary(file, { folder }))
  );
  return results;
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: string;
  } = {}
): string {
  if (!url || !url.includes('cloudinary')) return url;

  const { width, height, crop = 'fill', quality = 'auto' } = options;

  let transformation = `q_${quality},f_auto`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  if (crop) transformation += `,c_${crop}`;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  return `${beforeUpload}${transformation}/${afterUpload}`;
}

/**
 * Get profile thumbnail
 */
export function getProfileThumbnail(url: string, size = 100): string {
  return getOptimizedUrl(url, { width: size, height: size, crop: 'fill' });
}

export const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.cloudName;

