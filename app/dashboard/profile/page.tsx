"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

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

interface PasswordValidation {
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setFormData(prev => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);  // No need for formData dependency since we're using functional update

  const validatePassword = (password: string) => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, newPassword: value });
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isChangingPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const isValid = Object.values(passwordValidation).every(Boolean);
      if (!isValid) {
        setError("Please meet all password requirements");
        return;
      }
    }

    try {
      const endpoint = isChangingPassword ? "/api/auth/password" : "/api/auth/profile";
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsEditing(false);
        setIsChangingPassword(false);
        const userData = await res.json();
        setUser(userData);
      } else {
        const error = await res.json();
        setError(error.message || "Failed to update profile");
      }
    } catch (error) {
      setError("An error occurred while updating your profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {isChangingPassword && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            {!isEditing && !isChangingPassword && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            )}

            {(isEditing || isChangingPassword) && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setIsChangingPassword(false);
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
