"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { FaUser, FaLock, FaCog } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    dailyGoal?: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'newPassword') {
      setPasswordValidation({
        hasMinLength: value.length >= 8,
        hasLetter: /[A-Za-z]/.test(value),
        hasNumber: /\d/.test(value)
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const isValid = Object.values(passwordValidation).every(Boolean);
    if (!isValid) {
      setError("Please meet all password requirements");
      return;
    }

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (res.ok) {
        setIsChangingPassword(false);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await res.json();
        setError(error.message || "Failed to update password");
      }
    } catch (error) {
      setError("An error occurred while updating your password");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                <p className="text-sm text-gray-500 mt-1">View and manage your profile details</p>
              </div>
              <Button 
                onClick={() => router.push('/dashboard/profile/edit')}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">{user?.email || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Daily Calorie Goal</label>
                <p className="mt-1 text-gray-900">{user?.preferences?.dailyGoal || 2000} kcal</p>
              </div>
            </div>
          </Card>

          {/* Password Change Form */}
          {isChangingPassword && (
            <Card className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
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
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Side Section */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/dashboard/profile/edit')}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaUser className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaLock className="w-4 h-4 mr-2" />
                Change Password
              </button>
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaCog className="w-4 h-4 mr-2" />
                Manage Settings
              </button>
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Profile strength</span>
                <span className="font-medium text-teal-600">Good</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
              <p className="text-sm text-gray-500">Complete your profile to get personalized meal recommendations</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
