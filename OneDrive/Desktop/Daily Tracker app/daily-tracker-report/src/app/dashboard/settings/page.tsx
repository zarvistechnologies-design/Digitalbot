"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { User, Bell, Clock, Save, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface UserSettings {
  name: string;
  timezone: string;
  wakeTime: string;
  sleepTime: string;
  workStartTime: string;
  workEndTime: string;
  notificationTime: string;
  peakEnergyTime: string;
  lowEnergyTime: string;
}

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "UTC", label: "UTC" },
];

const ENERGY_TIMES = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { value: "evening", label: "Evening (5 PM - 9 PM)" },
  { value: "night", label: "Night (9 PM - 12 AM)" },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<UserSettings>();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.user) {
          Object.entries(data.user).forEach(([key, value]) => {
            if (value && key in data.user) {
              setValue(key as keyof UserSettings, value as string);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: UserSettings) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Update session if name changed
      if (data.name !== session?.user?.name) {
        await update({ name: data.name });
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-violet-600" />
              Profile
            </CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name" {...register("name")} />
            <Select label="Timezone" options={TIMEZONES} {...register("timezone")} />
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-violet-600" />
              Daily Schedule
            </CardTitle>
            <CardDescription>Your typical daily routine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Wake Time" type="time" {...register("wakeTime")} />
              <Input label="Sleep Time" type="time" {...register("sleepTime")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Work Start" type="time" {...register("workStartTime")} />
              <Input label="Work End" type="time" {...register("workEndTime")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Peak Energy Time"
                options={ENERGY_TIMES}
                {...register("peakEnergyTime")}
              />
              <Select
                label="Low Energy Time"
                options={ENERGY_TIMES}
                {...register("lowEnergyTime")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-violet-600" />
              Notifications
            </CardTitle>
            <CardDescription>When to remind you for daily check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Daily Check-in Reminder"
              type="time"
              {...register("notificationTime")}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button type="submit" isLoading={isSaving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}
