"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { validatePassword } from "@/utils/validation";

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
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
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
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'newPassword') {
      const { validation } = validatePassword(value);
      setPasswordValidation(validation);
    }
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

      <ProfileCard
        isEditing={isEditing}
        isChangingPassword={isChangingPassword}
        formData={formData}
        error={error}
        passwordValidation={passwordValidation}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onEditClick={() => setIsEditing(true)}
        onChangePasswordClick={() => setIsChangingPassword(true)}
        onCancelClick={() => {
          setIsEditing(false);
          setIsChangingPassword(false);
          setError("");
        }}
      />
    </div>
  );
}
