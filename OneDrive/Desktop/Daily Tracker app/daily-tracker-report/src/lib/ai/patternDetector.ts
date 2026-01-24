import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface DailyLogEntry {
  taskId: string;
  taskName: string;
  date: string;
  completed: boolean;
  skipped: boolean;
  timeSlot: string;
  energyLevel: string | null;
  mood: string | null;
  remarksText: string | null;
}

interface DetectedPattern {
  patternType: string;
  patternDetail: {
    description: string;
    frequency: number;
    confidence: number;
    triggerConditions: string[];
  };
  suggestedFix: string;
  priority: "high" | "medium" | "low";
}

interface PatternAnalysisResult {
  patterns: DetectedPattern[];
  overallInsights: string[];
  recommendations: string[];
}

export async function detectProcrastinationPatterns(
  logs: DailyLogEntry[],
  taskCompletionRates: Record<string, number>
): Promise<PatternAnalysisResult> {
  const prompt = `You are an expert behavioral psychologist specializing in procrastination patterns and productivity optimization.

Analyze the following daily logs to identify procrastination patterns:

DAILY LOGS (Last 14 days):
${logs
  .map(
    (log) => `
Date: ${log.date}
Task: ${log.taskName} (ID: ${log.taskId})
Time Slot: ${log.timeSlot}
Status: ${log.completed ? "Completed" : log.skipped ? "Skipped" : "Not Completed"}
Energy Level: ${log.energyLevel || "Not recorded"}
Mood: ${log.mood || "Not recorded"}
Remarks: ${log.remarksText || "None"}
`
  )
  .join("\n---\n")}

TASK COMPLETION RATES:
${Object.entries(taskCompletionRates)
  .map(([task, rate]) => `- ${task}: ${(rate * 100).toFixed(1)}%`)
  .join("\n")}

Identify patterns such as:
1. TIME_OF_DAY: Tasks consistently skipped at certain times
2. ENERGY_RELATED: Tasks skipped when energy is low
3. MOOD_RELATED: Tasks skipped based on mood states
4. TASK_SEQUENCE: Tasks skipped after certain other tasks
5. DAY_OF_WEEK: Weekend vs weekday patterns
6. TASK_SPECIFIC: Specific tasks that are avoided

For each pattern, provide:
- Clear description of the pattern
- How often it occurs (frequency)
- Confidence level (0-1)
- What triggers this pattern
- Actionable suggestion to fix it

Return JSON:
{
  "patterns": [
    {
      "patternType": "TIME_OF_DAY|ENERGY_RELATED|MOOD_RELATED|TASK_SEQUENCE|DAY_OF_WEEK|TASK_SPECIFIC",
      "patternDetail": {
        "description": "Clear description of the pattern",
        "frequency": 5,
        "confidence": 0.85,
        "triggerConditions": ["condition1", "condition2"]
      },
      "suggestedFix": "Actionable suggestion",
      "priority": "high|medium|low"
    }
  ],
  "overallInsights": [
    "General insight about user's productivity patterns"
  ],
  "recommendations": [
    "Top recommendation for improvement"
  ]
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
    console.error("Error detecting patterns:", error);
    throw error;
  }
}

export async function generateWeeklyInsights(
  weeklyData: {
    completedTasks: number;
    totalTasks: number;
    avgEnergy: number;
    avgMood: string;
    mostProductiveTime: string;
    leastProductiveTime: string;
    streakDays: number;
    patterns: DetectedPattern[];
  }
): Promise<{
  summary: string;
  energyInsights: string[];
  moodInsights: string[];
  productivityTips: string[];
  celebration: string;
}> {
  const prompt = `Generate a personalized weekly report for a user with the following stats:

WEEKLY STATS:
- Tasks Completed: ${weeklyData.completedTasks}/${weeklyData.totalTasks} (${((weeklyData.completedTasks / weeklyData.totalTasks) * 100).toFixed(1)}%)
- Average Energy Level: ${weeklyData.avgEnergy}/3
- Predominant Mood: ${weeklyData.avgMood}
- Most Productive Time: ${weeklyData.mostProductiveTime}
- Least Productive Time: ${weeklyData.leastProductiveTime}
- Current Streak: ${weeklyData.streakDays} days
- Detected Patterns: ${weeklyData.patterns.length}

Write in a friendly, encouraging tone. Be specific and actionable.

Return JSON:
{
  "summary": "2-3 sentence overall summary",
  "energyInsights": ["insight1", "insight2"],
  "moodInsights": ["insight1", "insight2"],
  "productivityTips": ["tip1", "tip2", "tip3"],
  "celebration": "Something positive to celebrate about this week"
}

Return ONLY valid JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
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
    console.error("Error generating weekly insights:", error);
    throw error;
  }
}
