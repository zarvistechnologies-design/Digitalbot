"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getGreeting, formatDate, formatTime } from "@/lib/utils/date";
import {
  Check,
  SkipForward,
  Mic,
  MicOff,
  Clock,
  Zap,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";

interface ScheduledTask {
  id: string;
  taskId: string;
  timeSlot: string;
  energyRequired: string;
  task: {
    id: string;
    title: string;
    description: string | null;
    difficultyLevel: string;
    estimatedHours: number;
  };
}

interface DailyPlan {
  id: string;
  date: string;
  scheduledTasks: ScheduledTask[];
  goal: {
    id: string;
    title: string;
  };
}

interface TaskLog {
  taskId: string;
  completed: boolean;
  skipped: boolean;
  energyLevel: string | null;
  mood: string | null;
  remarksText: string;
  timeSpent: number | null;
}

const ENERGY_LEVELS = [
  { value: "low", label: "Low", icon: "😴", color: "text-orange-500" },
  { value: "medium", label: "Medium", icon: "😐", color: "text-yellow-500" },
  { value: "high", label: "High", icon: "⚡", color: "text-green-500" },
];

const MOODS = [
  { value: "happy", label: "Happy", icon: "😊", color: "text-green-500" },
  { value: "neutral", label: "Neutral", icon: "😐", color: "text-gray-500" },
  { value: "down", label: "Down", icon: "😔", color: "text-blue-500" },
  { value: "stressed", label: "Stressed", icon: "😤", color: "text-red-500" },
];

export default function TrackerPage() {
  const { data: session } = useSession();
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [taskLogs, setTaskLogs] = useState<Record<string, TaskLog>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTaskId, setRecordingTaskId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const response = await fetch(`/api/daily-log?date=${new Date().toISOString()}`);
        const data = await response.json();

        setDailyPlan(data.dailyPlan);

        // Initialize task logs from existing data
        const existingLogs: Record<string, TaskLog> = {};
        if (data.logs) {
          data.logs.forEach((log: any) => {
            existingLogs[log.taskId] = {
              taskId: log.taskId,
              completed: log.completed,
              skipped: log.skipped,
              energyLevel: log.energyLevel,
              mood: log.mood,
              remarksText: log.remarksText || "",
              timeSpent: log.timeSpent,
            };
          });
        }

        // Initialize empty logs for tasks not yet logged
        if (data.dailyPlan?.scheduledTasks) {
          data.dailyPlan.scheduledTasks.forEach((st: ScheduledTask) => {
            if (!existingLogs[st.taskId]) {
              existingLogs[st.taskId] = {
                taskId: st.taskId,
                completed: false,
                skipped: false,
                energyLevel: null,
                mood: null,
                remarksText: "",
                timeSpent: null,
              };
            }
          });
        }

        setTaskLogs(existingLogs);
      } catch (error) {
        console.error("Error fetching daily data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, []);

  const updateTaskLog = (taskId: string, updates: Partial<TaskLog>) => {
    setTaskLogs((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...updates,
      },
    }));
  };

  const markComplete = (taskId: string) => {
    updateTaskLog(taskId, { completed: true, skipped: false });
    setExpandedTask(taskId);
  };

  const markSkipped = (taskId: string) => {
    updateTaskLog(taskId, { completed: false, skipped: true });
    setExpandedTask(taskId);
  };

  const startRecording = async (taskId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Convert to text using Web Speech API
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        // For now, we'll just save the text input
        // In production, you'd send this to a transcription service
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTaskId(taskId);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTaskId(null);
    }
  };

  const submitLogs = async () => {
    setIsSaving(true);
    try {
      const logs = Object.values(taskLogs).map((log) => ({
        ...log,
        date: new Date().toISOString(),
      }));

      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit logs");
      }

      alert("Daily logs saved successfully! 🎉");
    } catch (error) {
      console.error("Error submitting logs:", error);
      alert("Failed to save logs. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = Object.values(taskLogs).filter((l) => l.completed).length;
  const totalCount = dailyPlan?.scheduledTasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!dailyPlan || !dailyPlan.scheduledTasks?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
          <Clock className="h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
          No tasks scheduled for today
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a goal to get your personalized daily schedule
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {session?.user?.name?.split(" ")[0]}! ✨
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{formatDate(new Date())}</p>
        <div className="mt-4">
          <div className="mb-2 flex justify-center gap-2 text-sm">
            <Badge variant="default">{completedCount}/{totalCount} tasks</Badge>
            <Badge variant={progress === 100 ? "success" : "secondary"}>
              {Math.round(progress)}% complete
            </Badge>
          </div>
          <Progress value={progress} size="md" variant={progress === 100 ? "success" : "default"} />
        </div>
      </div>

      {/* Goal Context */}
      <Card className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-900/20">
        <CardContent className="flex items-center gap-3 py-4">
          <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            Working on: {dailyPlan.goal.title}
          </span>
        </CardContent>
      </Card>

      {/* Task Cards */}
      <div className="space-y-4">
        {dailyPlan.scheduledTasks.map((scheduledTask) => {
          const log = taskLogs[scheduledTask.taskId];
          const isExpanded = expandedTask === scheduledTask.taskId;
          const isDone = log?.completed || log?.skipped;

          return (
            <Card
              key={scheduledTask.id}
              className={`transition-all ${
                isDone
                  ? log.completed
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                {/* Task Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {log?.completed && <Check className="h-5 w-5 text-green-500" />}
                      {log?.skipped && <SkipForward className="h-5 w-5 text-orange-500" />}
                      <h3
                        className={`font-semibold ${
                          isDone ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {scheduledTask.task.title}
                      </h3>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {scheduledTask.timeSlot}
                      </span>
                      <Badge
                        variant={
                          scheduledTask.task.difficultyLevel === "easy"
                            ? "success"
                            : scheduledTask.task.difficultyLevel === "hard"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {scheduledTask.task.difficultyLevel}
                      </Badge>
                      <span>{scheduledTask.task.estimatedHours}h</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isDone && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => markComplete(scheduledTask.taskId)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markSkipped(scheduledTask.taskId)}
                      >
                        <SkipForward className="mr-1 h-4 w-4" />
                        Skip
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expanded Details (for logging) */}
                {(isExpanded || isDone) && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    {/* Energy Level */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        How was your energy?
                      </label>
                      <div className="flex gap-2">
                        {ENERGY_LEVELS.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => updateTaskLog(scheduledTask.taskId, { energyLevel: level.value })}
                            className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                              log?.energyLevel === level.value
                                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                            }`}
                          >
                            <span className="text-2xl">{level.icon}</span>
                            <span className="text-xs font-medium">{level.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mood */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        How did you feel?
                      </label>
                      <div className="flex gap-2">
                        {MOODS.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => updateTaskLog(scheduledTask.taskId, { mood: mood.value })}
                            className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                              log?.mood === mood.value
                                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                            }`}
                          >
                            <span className="text-xl">{mood.icon}</span>
                            <span className="text-xs font-medium">{mood.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Remarks */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Any remarks?
                        </label>
                        <button
                          onClick={() =>
                            isRecording && recordingTaskId === scheduledTask.taskId
                              ? stopRecording()
                              : startRecording(scheduledTask.taskId)
                          }
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                            isRecording && recordingTaskId === scheduledTask.taskId
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {isRecording && recordingTaskId === scheduledTask.taskId ? (
                            <>
                              <MicOff className="h-3.5 w-3.5" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Mic className="h-3.5 w-3.5" />
                              Voice
                            </>
                          )}
                        </button>
                      </div>
                      <Textarea
                        placeholder="Any blockers, learnings, or notes..."
                        value={log?.remarksText || ""}
                        onChange={(e) =>
                          updateTaskLog(scheduledTask.taskId, { remarksText: e.target.value })
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-4 mt-8">
        <Button
          onClick={submitLogs}
          isLoading={isSaving}
          className="w-full py-6 text-lg shadow-lg"
          disabled={completedCount === 0}
        >
          <Send className="mr-2 h-5 w-5" />
          Submit Daily Log
        </Button>
      </div>
    </div>
  );
}
