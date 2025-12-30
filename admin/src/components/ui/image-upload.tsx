import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import { uploadToCloudinary, UploadResult } from '../../lib/cloudinary';
import { Button } from './button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  disabled?: boolean;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'tijaniyah/admin',
  className,
  aspectRatio = 'square',
  disabled = false,
  placeholder = 'Click or drag to upload image',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result: UploadResult = await uploadToCloudinary(file, { folder });
      
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="sr-only"
        id="image-upload"
      />
      
      {value ? (
        <div className={cn('relative group rounded-lg overflow-hidden', aspectRatioClass)}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            aspectRatioClass,
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed',
            isUploading && 'pointer-events-none'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{placeholder}</span>
              <span className="text-xs text-muted-foreground/70">
                PNG, JPG or GIF up to 10MB
              </span>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder = 'tijaniyah/admin',
  maxImages = 4,
  className,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    if (validFiles.length === 0) {
      setError('Please upload image files');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const results = await Promise.all(
        validFiles.map((file) => uploadToCloudinary(file, { folder }))
      );

      const successfulUrls = results
        .filter((r) => r.success && r.url)
        .map((r) => r.url as string);

      if (successfulUrls.length > 0) {
        onChange([...value, ...successfulUrls]);
      }

      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        setError(`${failures.length} image(s) failed to upload`);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
            <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <label
            className={cn(
              'flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed cursor-pointer transition-colors',
              'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
              disabled && 'opacity-50 cursor-not-allowed',
              isUploading && 'pointer-events-none'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              disabled={disabled || isUploading}
              className="sr-only"
            />
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxImages} images uploaded
      </p>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

