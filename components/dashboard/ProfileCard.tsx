"use client";
import { useState, useEffect } from "react";
import { FaUser, FaBullseye, FaSync } from "react-icons/fa";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserProfile {
  name?: string;
  email?: string;
  image?: string;
  dailyGoal?: number;
}

export default function ProfileCard() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    dailyGoal: 2000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/profile?t=${timestamp}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in");
        } else {
          throw new Error(`Failed to load profile`);
        }
      }
      
      const profileData = await response.json();
      
      if (profileData && typeof profileData === 'object') {
        setProfile({
          name: profileData.name,
          email: profileData.email,
          image: profileData.image,
          dailyGoal: profileData.dailyGoal || 2000
        });
      } else {
        throw new Error("Invalid data");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <Card className="flex items-center p-3">
        <div className="animate-pulse flex items-center space-x-3 w-full">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  // If there's an error, show compact error state
  if (error) {
    return (
      <Card className="p-3 flex items-center justify-between">
        <p className="text-sm text-red-600">{error}</p>
        <Button onClick={fetchProfile} className="p-1 text-xs">
          <FaSync className="h-3 w-3" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <div className="flex items-center">
        <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center mr-3">
          {profile.image ? (
            <Image 
              src={profile.image} 
              alt={profile.name || "User"} 
              width={40} 
              height={40}
              className="rounded-full object-cover" 
            />
          ) : (
            <FaUser className="text-white text-sm" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-gray-800">{profile.name || "User"}</h3>
          <div className="flex items-center text-xs text-gray-500">
            <FaBullseye className="h-3 w-3 mr-1 text-teal-500" />
            <span>{profile.dailyGoal || 2000} kcal goal</span>
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/profile")}
          className="text-xs p-1.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white"
        >
          Edit
        </Button>
      </div>
    </Card>
  );
}
