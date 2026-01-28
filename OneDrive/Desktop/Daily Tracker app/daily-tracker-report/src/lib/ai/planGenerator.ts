import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Task {
  id: string;
  title: string;
  description?: string;
  difficultyLevel: string;
  estimatedHours: number;
  category?: string;
  dependencies: string[];
}

interface UserPreferences {
  wakeTime: string;
  sleepTime: string;
  workStartTime: string;
  workEndTime: string;
  peakEnergyTime: string;
  lowEnergyTime: string;
  timezone: string;
}

interface GeneratedSchedule {
  dailySchedule: DailyScheduleItem[];
  insights: string[];
  recommendations: string[];
}

interface DailyScheduleItem {
  date: string;
  tasks: ScheduledTaskItem[];
}

interface ScheduledTaskItem {
  taskId: string;
  taskName: string;
  timeSlot: string;
  difficulty: string;
  energyRequired: string;
  estimatedHours: number;
}

export async function generatePlan(
  tasks: Task[],
  userPreferences: UserPreferences,
  startDate: Date,
  endDate: Date
): Promise<GeneratedSchedule> {
  const prompt = `You are an expert productivity planner and task scheduler. Based on the user's tasks and preferences, create an optimal daily schedule.

USER PREFERENCES:
- Wake Time: ${userPreferences.wakeTime}
- Sleep Time: ${userPreferences.sleepTime}
- Work Hours: ${userPreferences.workStartTime} - ${userPreferences.workEndTime}
- Peak Energy Time: ${userPreferences.peakEnergyTime}
- Low Energy Time: ${userPreferences.lowEnergyTime}
- Timezone: ${userPreferences.timezone}

TASKS TO SCHEDULE:
${tasks
  .map(
    (task, index) => `
${index + 1}. Task ID: ${task.id}
   Title: ${task.title}
   Description: ${task.description || "N/A"}
   Difficulty: ${task.difficultyLevel}
   Estimated Hours: ${task.estimatedHours}
   Category: ${task.category || "General"}
   Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(", ") : "None"}
`
  )
  .join("\n")}

DATE RANGE:
- Start Date: ${startDate.toISOString().split("T")[0]}
- End Date: ${endDate.toISOString().split("T")[0]}

SCHEDULING RULES:
1. Schedule high-difficulty tasks during peak energy times
2. Schedule low-difficulty tasks during low energy times
3. Respect task dependencies (Task B after Task A if dependent)
4. Don't schedule more than 6-8 productive hours per day
5. Include breaks between intensive tasks
6. Distribute tasks evenly across the date range
7. Leave buffer time for task overruns
8. Consider revision/review cycles for learning tasks

Please provide a JSON response with this exact structure:
{
  "dailySchedule": [
    {
      "date": "YYYY-MM-DD",
      "tasks": [
        {
          "taskId": "task_id",
          "taskName": "Task Title",
          "timeSlot": "HH:MM-HH:MM",
          "difficulty": "easy|medium|hard",
          "energyRequired": "low|medium|high",
          "estimatedHours": 2
        }
      ]
    }
  ],
  "insights": [
    "Key insight about the schedule"
  ],
  "recommendations": [
    "Recommendation for better productivity"
  ]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }

    const schedule: GeneratedSchedule = JSON.parse(jsonMatch[0]);
    return schedule;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
}

export async function regenerateDayPlan(
  incompleteTasks: Task[],
  completedTasks: Task[],
  userPreferences: UserPreferences,
  dailyLog: {
    energyLevel: string;
    mood: string;
    remarks: string;
  },
  nextDate: Date
): Promise<DailyScheduleItem> {
  const prompt = `You are an adaptive productivity planner. Based on today's performance, reschedule incomplete tasks for tomorrow.

TODAY'S PERFORMANCE:
- Energy Level: ${dailyLog.energyLevel}
- Mood: ${dailyLog.mood}
- User Remarks: ${dailyLog.remarks}

COMPLETED TASKS:
${completedTasks.map((t) => `- ${t.title}`).join("\n") || "None"}

INCOMPLETE TASKS TO RESCHEDULE:
${incompleteTasks
  .map(
    (task) => `
- Task ID: ${task.id}
  Title: ${task.title}
  Difficulty: ${task.difficultyLevel}
  Estimated Hours: ${task.estimatedHours}
`
  )
  .join("\n")}

USER PREFERENCES:
- Peak Energy Time: ${userPreferences.peakEnergyTime}
- Low Energy Time: ${userPreferences.lowEnergyTime}
- Work Hours: ${userPreferences.workStartTime} - ${userPreferences.workEndTime}

RESCHEDULING DATE: ${nextDate.toISOString().split("T")[0]}

Based on the user's energy and mood patterns, create an optimized schedule for tomorrow.
If the user reported low energy or negative mood, consider:
1. Reducing the difficulty of morning tasks
2. Adding more breaks
3. Prioritizing essential tasks only

Return JSON:
{
  "date": "YYYY-MM-DD",
  "tasks": [
    {
      "taskId": "task_id",
      "taskName": "Task Title",
      "timeSlot": "HH:MM-HH:MM",
      "difficulty": "easy|medium|hard",
      "energyRequired": "low|medium|high",
      "estimatedHours": 2
    }
  ],
  "adjustmentReason": "Why these adjustments were made"
}

Return ONLY valid JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error regenerating day plan:", error);
    throw error;
  }
}
