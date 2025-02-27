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

interface ProfileCardProps {
  isEditing?: boolean;
  isChangingPassword?: boolean;
  formData: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  error?: string;
  passwordValidation: {
    hasMinLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
  onCancelClick: () => void;
}

export default function ProfileCard({
  isEditing = false,
  isChangingPassword = false,
  formData,
  error: errorProp,
  passwordValidation,
  onFormChange,
  onSubmit,
  onEditClick,
  onChangePasswordClick,
  onCancelClick
}: ProfileCardProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    dailyGoal: 2000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    setIsLoading(true);
    setLoadError(null);
    
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
      setLoadError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing && !isChangingPassword) {
      fetchProfile();
    }
  }, [isEditing, isChangingPassword]);

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

  if (loadError) {
    return (
      <Card className="p-3 flex items-center justify-between">
        <p className="text-sm text-red-600">{loadError}</p>
        <Button onClick={fetchProfile} className="p-1 text-xs">
          <FaSync className="h-3 w-3" />
        </Button>
      </Card>
    );
  }

  if (isEditing || isChangingPassword) {
    return (
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {errorProp && (
            <div className="text-sm text-red-600 mb-4">
              {errorProp}
            </div>
          )}
          
          {!isChangingPassword ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => onFormChange('currentPassword', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => onFormChange('newPassword', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
                <div className="mt-2 space-y-1">
                  <p className={`text-sm ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                    • At least 8 characters
                  </p>
                  <p className={`text-sm ${passwordValidation.hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
                    • Contains at least one letter
                  </p>
                  <p className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    • Contains at least one number
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => onFormChange('confirmPassword', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onCancelClick} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
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
        <div className="space-x-2">
          <Button
            onClick={onEditClick}
            variant="secondary"
            className="text-xs"
          >
            Edit Profile
          </Button>
          <Button
            onClick={onChangePasswordClick}
            variant="secondary"
            className="text-xs"
          >
            Change Password
          </Button>
        </div>
      </div>
    </Card>
  );
}
