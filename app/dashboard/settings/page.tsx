"use client";

import { useState } from "react";
import Button from "@/components/Button";

interface SettingsSection {
  title: string;
  description: string;
  controls: React.ReactNode;
}

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mealReminders, setMealReminders] = useState(true);

  const handleSaveSettings = async () => {
    // TODO: Implement settings save
    console.log("Saving settings...");
  };

  const sections: SettingsSection[] = [
    {
      title: "Notifications",
      description: "Configure how and when you receive notifications",
      controls: (
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span>Enable notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={mealReminders}
              onChange={(e) => setMealReminders(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span>Daily meal logging reminders</span>
          </label>
        </div>
      ),
    },
    {
      title: "Appearance",
      description: "Customize how FoodSnap looks on your device",
      controls: (
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <span>Dark mode</span>
        </label>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </div>
            <div className="pt-4">{section.controls}</div>
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSaveSettings}
            className="px-6"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
