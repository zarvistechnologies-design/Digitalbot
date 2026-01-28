import { z } from "zod";

export const basicInfoSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  sleepTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  workStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  workEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  notificationTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
});

export const goalSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  description: z.string().optional(),
  targetEndDate: z.string().min(1, "Target end date is required"),
  imageUrl: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  estimatedHours: z.number().min(0.5, "Minimum 30 minutes"),
  category: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const energyPatternsSchema = z.object({
  peakEnergyTime: z.enum(["morning", "afternoon", "evening", "night"]),
  lowEnergyTime: z.enum(["morning", "afternoon", "evening", "night"]),
  busyDays: z.array(z.string()).optional(),
  freeDays: z.array(z.string()).optional(),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type EnergyPatternsInput = z.infer<typeof energyPatternsSchema>;
