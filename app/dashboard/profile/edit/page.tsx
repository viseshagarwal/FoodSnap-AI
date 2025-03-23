"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dailyGoal?: number;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  dietaryType?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    dailyGoal: 2000,
    height: 0,
    weight: 0,
    age: 0,
    gender: "",
    activityLevel: "",
    dietaryType: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      router.push("/dashboard/profile");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="mt-2 text-gray-600">Update your personal information and preferences</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Physical Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={formData.age || ""}
                      onChange={(e) => handleChange("age", parseInt(e.target.value))}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="0"
                      max="120"
                    />
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={formData.height || ""}
                      onChange={(e) => handleChange("height", parseInt(e.target.value))}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={formData.weight || ""}
                      onChange={(e) => handleChange("weight", parseInt(e.target.value))}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Level
                    </label>
                    <select
                      id="activityLevel"
                      value={formData.activityLevel}
                      onChange={(e) => handleChange("activityLevel", e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select activity level</option>
                      <option value="SEDENTARY">Sedentary</option>
                      <option value="LIGHT">Lightly Active</option>
                      <option value="MODERATE">Moderately Active</option>
                      <option value="VERY_ACTIVE">Very Active</option>
                      <option value="EXTRA_ACTIVE">Extra Active</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dietaryType" className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Type
                    </label>
                    <select
                      id="dietaryType"
                      value={formData.dietaryType}
                      onChange={(e) => handleChange("dietaryType", e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select dietary type</option>
                      <option value="OMNIVORE">Omnivore</option>
                      <option value="VEGETARIAN">Vegetarian</option>
                      <option value="VEGAN">Vegan</option>
                      <option value="PESCATARIAN">Pescatarian</option>
                      <option value="KETO">Keto</option>
                      <option value="PALEO">Paleo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Calorie Goal
                    </label>
                    <input
                      type="number"
                      id="dailyGoal"
                      value={formData.dailyGoal || ""}
                      onChange={(e) => handleChange("dailyGoal", parseInt(e.target.value))}
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}