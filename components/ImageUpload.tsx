"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { FaUpload, FaSpinner, FaTrash } from "react-icons/fa";

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
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    // Check maximum images
    if (existingImages.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      // Initialize FormData before using it
      const formData = new FormData();
      formData.append("file", file);
      if (mealId) {
        formData.append("mealId", mealId);
      }

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || "Upload failed");
      }

      const data = await response.json();
      onImageUpload(data);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [existingImages.length, maxImages, mealId, onImageUpload]);

  const handleUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDelete = useCallback(
    async (imageId: string) => {
      try {
        const response = await fetch(`/api/images?id=${imageId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Delete failed");
        }

        onImageDelete?.(imageId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete image");
        console.error("Delete error:", err);
      }
    },
    [onImageDelete]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const isDisabled = uploading || existingImages.length >= maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="flex items-center justify-center w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
            dragActive
              ? "border-teal-500 bg-teal-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={!isDisabled ? handleDrop : undefined}
          onClick={!isDisabled ? handleButtonClick : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!isDisabled) {
                handleButtonClick();
              }
            }
          }}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label="Upload image"
          aria-disabled={isDisabled}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
            ) : (
              <>
                <FaUpload className={`w-8 h-8 mb-2 ${dragActive ? "text-teal-500" : "text-gray-500"}`} />
                <p className="text-sm text-gray-500">
                  {dragActive ? "Drop your image here" : "Click or drag to upload an image"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isDisabled 
                    ? `Maximum ${maxImages} images reached`
                    : "(Max 10MB)"}
                </p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isDisabled}
            aria-label="Upload image input"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          role="alert" 
          className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
        >
          {error}
        </div>
      )}

      {/* Image Preview */}
      {existingImages.length > 0 && (
        <div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4" 
          role="list" 
          aria-label="Uploaded images"
        >
          {existingImages.map((image) => (
            <div 
              key={image.id} 
              className="relative group" 
              role="listitem"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              {onImageDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Delete image ${image.id}`}
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
