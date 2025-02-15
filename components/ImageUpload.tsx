import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FaUpload, FaSpinner, FaTrash } from 'react-icons/fa';

interface ImageUploadProps {
  onImageUpload: (imageData: { id: string; url: string }) => void;
  onImageDelete?: (imageId: string) => void;
  existingImages?: Array<{ id: string; url: string }>;
  mealId?: string;
  maxImages?: number;
}

export default function ImageUpload({
  onImageUpload,
  onImageDelete,
  existingImages = [],
  mealId,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    // Check maximum images
    if (existingImages.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      if (mealId) {
        formData.append('mealId', mealId);
      }

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [mealId, onImageUpload, existingImages.length, maxImages]);

  const handleDelete = useCallback(async (imageId: string) => {
    try {
      const response = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      onImageDelete?.(imageId);
    } catch (err) {
      setError('Failed to delete image');
      console.error('Delete error:', err);
    }
  }, [onImageDelete]);

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <FaSpinner className="w-8 h-8 text-gray-500 animate-spin" />
            ) : (
              <>
                <FaUpload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Click to upload an image</p>
                <p className="text-xs text-gray-500 mt-1">(Max 10MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading || existingImages.length >= maxImages}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {/* Image Preview */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {existingImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
              {onImageDelete && (
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 