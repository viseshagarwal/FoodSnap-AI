"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { FaArrowRight } from "react-icons/fa";

interface OnboardingFormData {
  age: string;
  height: string;
  weight: string;
  gender: string;
  activityLevel: string;
  dietaryType: string;
  weightGoal: string;
  allergies: string[];
  healthConditions: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OnboardingFormData>({
    age: "",
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    dietaryType: "",
    weightGoal: "",
    allergies: [],
    healthConditions: []
  });
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to save information");
      }
    } catch (err) {
      setError("An error occurred while saving your information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof OnboardingFormData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: 'allergies' | 'healthConditions', value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
                min="13"
                max="120"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
                min="100"
                max="250"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
                min="30"
                max="300"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                id="activityLevel"
                value={formData.activityLevel}
                onChange={(e) => handleChange("activityLevel", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              >
                <option value="">Select activity level</option>
                <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                <option value="LIGHT">Lightly active (exercise 1-3 times/week)</option>
                <option value="MODERATE">Moderately active (exercise 3-5 times/week)</option>
                <option value="VERY_ACTIVE">Very active (exercise 6-7 times/week)</option>
                <option value="EXTRA_ACTIVE">Extra active (very intense exercise daily)</option>
              </select>
            </div>

            <div>
              <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700">Weight Goal</label>
              <select
                id="weightGoal"
                value={formData.weightGoal}
                onChange={(e) => handleChange("weightGoal", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              >
                <option value="">Select weight goal</option>
                <option value="LOSE">Lose Weight</option>
                <option value="MAINTAIN">Maintain Weight</option>
                <option value="GAIN">Gain Weight</option>
              </select>
            </div>

            <div>
              <label htmlFor="dietaryType" className="block text-sm font-medium text-gray-700">Dietary Preference</label>
              <select
                id="dietaryType"
                value={formData.dietaryType}
                onChange={(e) => handleChange("dietaryType", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              >
                <option value="">Select dietary preference</option>
                <option value="OMNIVORE">Omnivore</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="VEGAN">Vegan</option>
                <option value="PESCATARIAN">Pescatarian</option>
                <option value="KETO">Keto</option>
                <option value="PALEO">Paleo</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <div className="space-y-2">
                {["DAIRY", "EGGS", "FISH", "SHELLFISH", "TREE_NUTS", "PEANUTS", "WHEAT", "SOY"].map((allergy) => (
                  <label key={allergy} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleArrayChange("allergies", allergy)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {allergy.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Conditions</label>
              <div className="space-y-2">
                {["DIABETES", "HYPERTENSION", "HEART_DISEASE", "CELIAC", "IBS"].map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(condition)}
                      onChange={() => handleArrayChange("healthConditions", condition)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {condition.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.age && formData.height && formData.weight && formData.gender;
      case 2:
        return formData.activityLevel && formData.weightGoal && formData.dietaryType;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to FoodSnap!</h1>
          <p className="mt-2 text-gray-600">Let's personalize your experience</p>
          
          {/* Progress indicator */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-all duration-200 ${
                  s === step ? 'bg-teal-500' : s < step ? 'bg-teal-200' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {renderStep()}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => validateStep() && setStep(step + 1)}
                  disabled={!validateStep()}
                  className="ml-auto"
                >
                  Next
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}