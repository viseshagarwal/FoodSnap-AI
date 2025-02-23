import React from 'react';
import { DetailCard } from '@/components/cards';
import Button from '@/components/Button';
import Input from '@/components/Input';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import { PasswordValidation } from '@/utils/validation';

interface ProfileCardProps {
  isEditing: boolean;
  isChangingPassword: boolean;
  formData: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  error?: string;
  passwordValidation: PasswordValidation;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
  onCancelClick: () => void;
}

export default function ProfileCard({
  isEditing,
  isChangingPassword,
  formData,
  error,
  passwordValidation,
  onFormChange,
  onSubmit,
  onEditClick,
  onChangePasswordClick,
  onCancelClick,
}: ProfileCardProps) {
  const content = (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
          disabled={!isEditing}
          className="disabled:bg-gray-50 disabled:text-gray-500"
        />

        <EmailInput
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
          disabled={!isEditing}
          className="disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {isChangingPassword && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          
          <PasswordInput
            id="currentPassword"
            label="Current Password"
            value={formData.currentPassword}
            onChange={(e) => onFormChange('currentPassword', e.target.value)}
          />

          <PasswordInput
            id="newPassword"
            label="New Password"
            value={formData.newPassword}
            onChange={(e) => onFormChange('newPassword', e.target.value)}
            showValidation
            validation={passwordValidation}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) => onFormChange('confirmPassword', e.target.value)}
          />
        </div>
      )}
    </form>
  );

  const actions = isEditing || isChangingPassword ? [
    {
      label: "Cancel",
      onClick: onCancelClick,
      variant: "secondary" as const,
    },
    {
      label: "Save Changes",
      onClick: (e: React.FormEvent) => onSubmit(e),
      variant: "primary" as const,
    },
  ] : [
    {
      label: "Change Password",
      onClick: onChangePasswordClick,
      variant: "secondary" as const,
    },
    {
      label: "Edit Profile",
      onClick: onEditClick,
      variant: "primary" as const,
    },
  ];

  return (
    <DetailCard
      title="Profile Information"
      description="Update your profile information and manage your account settings."
      content={content}
      actions={actions}
      status={error ? {
        type: 'error',
        message: error
      } : undefined}
    />
  );
}