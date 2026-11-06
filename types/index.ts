// Call related types
export interface Call {
  id: string;
  call_id?: string;
  session_id?: string;
  phone_number: string;
  from_number?: string;
  to_number?: string;
  direction: 'inbound' | 'outbound' | 'unknown';
  status: 'completed' | 'missed' | 'ongoing' | 'failed' | 'user-ended' | 'agent-ended' | 'timeout' | 'error' | 'in-progress' | 'ringing' | 'connecting' | 'cancelled' | 'busy' | 'no-answer';
  duration?: number;
  start_time?: string;
  end_time?: string;
  recording_url?: string;
  recordingUrl?: string;
  call_recording?: string;
  audio_url?: string;
  audioUrl?: string;
  recording?: string | {
    url?: string;
    recording_url?: string;
    audio_url?: string;
  };
  agent_id?: string;
  agent_name?: string;
  created_at?: string;
  updated_at?: string;
  chat?: string | any[];
  transcription?: string | any[];
  transcription_formatted?: string;
  comfort_analysis?: {
    comfort: 'comfortable' | 'uncomfortable' | 'not_assessed';
    sentiment: 'positive' | 'negative' | 'neutral' | 'unknown';
    reason: string;
    evidence: string;
  } | null;
  metadata?: {
    recording_url?: string;
    audio_url?: string;
    call_recording?: string;
    [key: string]: any;
  };
  agent_config?: {
    call_settings?: {
      enable_recording?: boolean;
    };
    [key: string]: any;
  };
  enable_recording?: boolean;
  recording_enabled?: boolean;
  settings?: {
    enable_recording?: boolean;
    [key: string]: any;
  };
  cost_breakdown?: any;
  chars_used?: number;
  function_calls?: any[];
}

// Transcription segment
export interface TranscriptionSegment {
  speaker: 'agent' | 'customer' | string;
  text: string;
  timestamp?: string;
  start_time?: number;
  end_time?: number;
}

// Call transcription
export interface CallTranscription {
  call_id: string;
  text?: string;
  segments?: TranscriptionSegment[];
  language?: string;
  confidence?: number;
  created_at?: string;
}

// Sentiment analysis
export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
  confidence: number;
  score?: number;
}

// Call analytics
export interface CallAnalytics {
  call_id: string;
  sentiment?: SentimentAnalysis;
  keywords?: string[];
  summary?: string;
  topics?: string[];
  action_items?: string[];
  customer_satisfaction_score?: number;
  created_at?: string;
}

// Agent type
export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'busy';
  total_calls?: number;
  created_at?: string;
}

// Statistics
export interface CallStats {
  total_calls: number;
  completed_calls: number;
  missed_calls: number;
  average_duration: number;
  total_duration: number;
  calls_by_status?: Record<string, number>;
  calls_by_direction?: Record<string, number>;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
