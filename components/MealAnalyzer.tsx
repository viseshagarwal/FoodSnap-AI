import React, { useState } from 'react';
import Image from 'next/image';
import { FaCamera, FaSync } from 'react-icons/fa';
import Button from './Button';

interface MealAnalysis {
  name: string;
  // description field removed from the interface to match the API
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
      console.log("Starting image analysis with file:", selectedImage.name, "size:", selectedImage.size, "type:", selectedImage.type);
      
      const formData = new FormData();
      formData.append('image', selectedImage);

      console.log("Sending request to /api/meals/analyze endpoint...");
      const response = await fetch('/api/meals/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important: include credentials for auth
      });

      console.log("Response status:", response.status, response.statusText);
      
      let data;
      try {
        const textResponse = await response.text();
        console.log("Raw API response:", textResponse);
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error(`Server returned invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Instead of redirecting, show an error message
          setError('Your session has expired. Please save your changes and log in again.');
          return;
        }
        console.error("API error details:", data);
        throw new Error(data.error || data.details || `Failed to analyze image: ${response.status} (${data ? JSON.stringify(data) : 'No error details'})`);
      }

      console.log("Analysis successful:", data);
      onAnalysis(data);
    } catch (err) {
      console.error("Image analysis error:", err);
      if (err instanceof Error) {
        console.error("Error stack:", err.stack);
      }
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
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
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
                className="!bg-white/90 backdrop-blur hover:!bg-white/95 transition-all shadow-sm"
              >
                Retake
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="!bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 backdrop-blur transition-all shadow-sm"
              >
                {analyzing ? (
                  <>
                    <FaSync className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      AI
                    </span>
                  </>
                )}
              </Button>
            </div>
            {analyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="text-center text-white p-4 rounded-lg">
                  <div className="animate-pulse mb-3">
                    <div className="mx-auto w-16 h-16 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
                  </div>
                  <p className="font-medium">Analyzing with AI...</p>
                  <p className="text-sm opacity-80 mt-1">Using Gemini Pro Vision to analyze your food</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
            <div className="p-4 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-all mb-3">
              <FaCamera className="w-8 h-8 text-teal-600 group-hover:text-teal-700 transition-all" />
            </div>
            <span className="text-sm font-medium text-gray-700 mb-1">Snap or upload your meal</span>
            <span className="text-xs text-gray-500 max-w-xs text-center">
              Powered by advanced AI vision technology
            </span>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-50 to-indigo-50 text-teal-800 border border-teal-100">
              <span className="mr-1">✨</span> Gemini Pro Vision
            </div>
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
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}