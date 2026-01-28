"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  ListTodo,
  Zap,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Clock },
  { id: 2, title: "Your Goal", icon: Target },
  { id: 3, title: "Add Tasks", icon: ListTodo },
  { id: 4, title: "Energy Patterns", icon: Zap },
  { id: 5, title: "Review", icon: Check },
];

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

interface Task {
  id: string;
  title: string;
  description: string;
  difficultyLevel: "easy" | "medium" | "hard";
  estimatedHours: number;
  category: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    timezone: "America/New_York",
    wakeTime: "07:00",
    sleepTime: "23:00",
    workStartTime: "09:00",
    workEndTime: "17:00",
    notificationTime: "22:00",
  });

  const [goal, setGoal] = useState({
    title: "",
    description: "",
    targetEndDate: "",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    difficultyLevel: "medium",
    estimatedHours: 2,
    category: "",
  });

  const [energyPatterns, setEnergyPatterns] = useState({
    peakEnergyTime: "morning",
    lowEnergyTime: "afternoon",
  });

  const addTask = () => {
    if (!newTask.title) return;
    setTasks([
      ...tasks,
      {
        id: `task_${Date.now()}`,
        title: newTask.title || "",
        description: newTask.description || "",
        difficultyLevel: newTask.difficultyLevel || "medium",
        estimatedHours: newTask.estimatedHours || 2,
        category: newTask.category || "",
      },
    ]);
    setNewTask({
      title: "",
      description: "",
      difficultyLevel: "medium",
      estimatedHours: 2,
      category: "",
    });
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsGenerating(true);

    try {
      // Update user profile
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicInfo,
          ...energyPatterns,
          onboardingComplete: true,
        }),
      });

      // Create goal with tasks
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: {
            ...goal,
            startDate: new Date().toISOString(),
          },
          tasks: tasks.map((t, index) => ({
            ...t,
            orderIndex: index,
            dependencies: [],
          })),
          generateSchedule: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return basicInfo.timezone && basicInfo.wakeTime && basicInfo.sleepTime;
      case 2:
        return goal.title && goal.targetEndDate;
      case 3:
        return tasks.length > 0;
      case 4:
        return energyPatterns.peakEnergyTime && energyPatterns.lowEnergyTime;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Let&apos;s set up your routine
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                This helps us schedule tasks at the right time for you
              </p>
            </div>

            <Select
              label="Your Timezone"
              options={TIMEZONES}
              value={basicInfo.timezone}
              onChange={(e) => setBasicInfo({ ...basicInfo, timezone: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Wake Time"
                type="time"
                value={basicInfo.wakeTime}
                onChange={(e) => setBasicInfo({ ...basicInfo, wakeTime: e.target.value })}
              />
              <Input
                label="Sleep Time"
                type="time"
                value={basicInfo.sleepTime}
                onChange={(e) => setBasicInfo({ ...basicInfo, sleepTime: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Work Start"
                type="time"
                value={basicInfo.workStartTime}
                onChange={(e) => setBasicInfo({ ...basicInfo, workStartTime: e.target.value })}
              />
              <Input
                label="Work End"
                type="time"
                value={basicInfo.workEndTime}
                onChange={(e) => setBasicInfo({ ...basicInfo, workEndTime: e.target.value })}
              />
            </div>

            <Input
              label="Daily Check-in Reminder Time"
              type="time"
              value={basicInfo.notificationTime}
              onChange={(e) => setBasicInfo({ ...basicInfo, notificationTime: e.target.value })}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What do you want to achieve?
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Define your main goal - we&apos;ll help you break it down
              </p>
            </div>

            <Input
              label="Goal Title"
              placeholder="e.g., Learn Python Programming"
              value={goal.title}
              onChange={(e) => setGoal({ ...goal, title: e.target.value })}
            />

            <Textarea
              label="Description (Optional)"
              placeholder="What does success look like for this goal?"
              value={goal.description}
              onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            />

            <Input
              label="Target Completion Date"
              type="date"
              value={goal.targetEndDate}
              onChange={(e) => setGoal({ ...goal, targetEndDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Break it down into tasks
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add the tasks needed to complete your goal
              </p>
            </div>

            {/* Task List */}
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge
                            variant={
                              task.difficultyLevel === "easy"
                                ? "success"
                                : task.difficultyLevel === "hard"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {task.difficultyLevel}
                          </Badge>
                          <span>{task.estimatedHours}h</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Task Form */}
            <div className="space-y-4 rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-600">
              <Input
                label="Task Title"
                placeholder="e.g., Learn OOP Concepts"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Difficulty"
                  options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                  value={newTask.difficultyLevel}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      difficultyLevel: e.target.value as "easy" | "medium" | "hard",
                    })
                  }
                />
                <Input
                  label="Estimated Hours"
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={newTask.estimatedHours}
                  onChange={(e) =>
                    setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) })
                  }
                />
              </div>

              <Button onClick={addTask} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                When are you at your best?
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                We&apos;ll schedule difficult tasks during your peak hours
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  When is your energy highest?
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["morning", "afternoon", "evening", "night"].map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        setEnergyPatterns({ ...energyPatterns, peakEnergyTime: time })
                      }
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        energyPatterns.peakEnergyTime === time
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <span className="text-2xl">
                        {time === "morning"
                          ? "🌅"
                          : time === "afternoon"
                          ? "☀️"
                          : time === "evening"
                          ? "🌆"
                          : "🌙"}
                      </span>
                      <p className="mt-1 text-sm font-medium capitalize">{time}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  When is your energy lowest?
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["morning", "afternoon", "evening", "night"].map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        setEnergyPatterns({ ...energyPatterns, lowEnergyTime: time })
                      }
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        energyPatterns.lowEnergyTime === time
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <span className="text-2xl">
                        {time === "morning"
                          ? "🌅"
                          : time === "afternoon"
                          ? "☀️"
                          : time === "evening"
                          ? "🌆"
                          : "🌙"}
                      </span>
                      <p className="mt-1 text-sm font-medium capitalize">{time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Review your setup
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Let&apos;s make sure everything looks good before we generate your plan
              </p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900 dark:text-white">{goal.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                  Target: {new Date(goal.targetEndDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tasks ({tasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li key={task.id} className="flex items-center gap-2 text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-600">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 dark:text-white">{task.title}</span>
                      <Badge variant={task.difficultyLevel === "easy" ? "success" : task.difficultyLevel === "hard" ? "danger" : "warning"} className="ml-auto">
                        {task.estimatedHours}h
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Peak Energy:</span>{" "}
                  <span className="font-medium capitalize">{energyPatterns.peakEnergyTime}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Work Hours:</span>{" "}
                  <span className="font-medium">
                    {basicInfo.workStartTime} - {basicInfo.workEndTime}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Daily Check-in:</span>{" "}
                  <span className="font-medium">{basicInfo.notificationTime}</span>
                </p>
              </CardContent>
            </Card>

            {isGenerating && (
              <div className="rounded-lg bg-violet-50 p-4 text-center dark:bg-violet-900/20">
                <Sparkles className="mx-auto h-8 w-8 animate-pulse text-violet-600" />
                <p className="mt-2 font-medium text-violet-600 dark:text-violet-400">
                  AI is generating your personalized schedule...
                </p>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-8 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / 5) * 100} className="mt-4" />
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!canProceed()}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate My Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
