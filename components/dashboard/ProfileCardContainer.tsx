"use client";
import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { useRouter } from "next/navigation";

export default function ProfileCardContainer() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false
  });

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate password if it's the password field
    if (field === 'newPassword') {
      setPasswordValidation({
        hasMinLength: value.length >= 8,
        hasLetter: /[a-zA-Z]/.test(value),
        hasNumber: /\d/.test(value)
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isChangingPassword) {
        // Password change logic
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        
        const response = await fetch('/api/profile/password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Password update failed');
        }

      } else {
        // Profile update logic
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Profile update failed');
        }
      }

      // Reset form state after successful submission
      setIsEditing(false);
      setIsChangingPassword(false);
      
      // Refresh the page to show updated data
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Start editing profile
  const handleEditClick = () => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || ''
        }));
        setIsEditing(true);
        setIsChangingPassword(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile data for editing', err);
      });
  };

  // Start changing password
  const handleChangePasswordClick = () => {
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  // Cancel editing or changing password
  const handleCancelClick = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setError(null);
  };

  return (
    <ProfileCard
      isEditing={isEditing}
      isChangingPassword={isChangingPassword}
      formData={formData}
      error={error || undefined}
      passwordValidation={passwordValidation}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onEditClick={handleEditClick}
      onChangePasswordClick={handleChangePasswordClick}
      onCancelClick={handleCancelClick}
    />
  );
}