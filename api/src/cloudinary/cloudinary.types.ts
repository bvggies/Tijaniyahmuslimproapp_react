export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

