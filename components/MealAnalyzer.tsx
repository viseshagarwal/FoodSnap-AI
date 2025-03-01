import React, { useState } from 'react';
import Image from 'next/image';
import { FaCamera, FaSync } from 'react-icons/fa';
import Button from './Button';

interface MealAnalysis {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  imageUrl?: string;
}

interface MealAnalyzerProps {
  onAnalysis: (analysis: MealAnalysis) => void;
}

export default function MealAnalyzer({ onAnalysis }: MealAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/meals/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important: include credentials for auth
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Instead of redirecting, show an error message
          setError('Your session has expired. Please save your changes and log in again.');
          return;
        }
        throw new Error(data.error || 'Failed to analyze image');
      }

      onAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
        {previewUrl ? (
          <>
            <div className="relative w-full h-full">
              <Image
                src={previewUrl}
                alt="Selected meal"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="absolute bottom-4 right-4 space-x-2">
              <Button
                variant="secondary"
                onClick={handleRetake}
                className="!bg-white/90 backdrop-blur"
              >
                Retake
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="!bg-teal-600/90 backdrop-blur"
              >
                {analyzing ? (
                  <>
                    <FaSync className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <FaCamera className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to take a photo or upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              capture="environment"
            />
          </label>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}