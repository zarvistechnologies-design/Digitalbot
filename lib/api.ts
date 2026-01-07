import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add cache busting for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(), // Add timestamp to prevent caching
      };
    }
    
    // Disable caching
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and auth
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors - invalid signature means token was signed with different secret
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear all auth data
      if (typeof window !== 'undefined') {
        console.log('🔒 Clearing invalid session, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const callsAPI = {
  // Health check
  healthCheck: () => {
    return api.get('/health');
  },

  // Get all calls
  getCalls: (params = {}) => {
    return api.get('/calls', { params });
  },

  // Get specific call details
  getCall: (callId: string) => {
    return api.get(`/calls/${callId}`);
  },

  // Get call transcription
  getCallTranscription: (callId: string) => {
    return api.get(`/calls/${callId}/transcription`);
  },

  // Get call recording URL
  getCallRecordingUrl: (callId: string) => {
    return `${API_BASE_URL}/calls/${callId}/recording`;
  },

  // Get call analytics
  getCallAnalytics: (callId: string) => {
    return api.get(`/calls/${callId}/analytics`);
  },

  // Search calls
  searchCalls: (query: string, params = {}) => {
    return api.get('/calls/search', { 
      params: { q: query, ...params } 
    });
  },

  // Get statistics
  getStats: (params = {}) => {
    return api.get('/stats', { params });
  },

  // Get all agents
  getAgents: () => {
    return api.get('/agents');
  },
};

// ========================================
// DOCTORS API
// ========================================
export const doctorsAPI = {
  // Get all doctors
  getAll: () => api.get('/doctors'),
  
  // Get doctor by ID
  getById: (id: string) => api.get(`/doctors/${id}`),
  
  // Create doctor
  create: (data: {
    name: string;
    specialization: string;
    phone: string;
    email?: string;
    slotDuration?: number;
    defaultWorkingHours?: { start: string; end: string };
    workingDays?: number[];
    calendarId?: string;
  }) => api.post('/doctors', data),
  
  // Update doctor
  update: (id: string, data: Partial<{
    name: string;
    specialization: string;
    phone: string;
    email: string;
    slotDuration: number;
    defaultWorkingHours: { start: string; end: string };
    workingDays: number[];
    active: boolean;
    calendarId: string;
  }>) => api.put(`/doctors/${id}`, data),
  
  // Delete doctor
  delete: (id: string) => api.delete(`/doctors/${id}`),
  
  // Toggle doctor status
  toggleStatus: (id: string, active: boolean) => 
    api.patch(`/doctors/${id}/status`, { active }),
};

// ========================================
// PROMPTS API
// ========================================
export const promptsAPI = {
  // Get all prompts
  getAll: () => api.get('/prompts'),
  
  // Get prompt by ID
  getById: (id: string) => api.get(`/prompts/${id}`),
  
  // Create prompt
  create: (data: {
    hospitalName: string;
    systemPrompt: string;
    greetingMessage?: string;
    closingMessage?: string;
    workingHours?: { start: string; end: string };
    workingDays?: number[];
    voiceConfig?: { language?: string; voiceId?: string; speed?: number; pitch?: number };
    features?: {
      appointmentBooking?: boolean;
      doctorAvailabilityCheck?: boolean;
      appointmentCancellation?: boolean;
      appointmentRescheduling?: boolean;
      emergencyHandling?: boolean;
    };
    notifications?: {
      smsEnabled?: boolean;
      whatsappEnabled?: boolean;
      emailEnabled?: boolean;
      notifyDoctorOnBooking?: boolean;
      notifyPatientOnBooking?: boolean;
    };
  }) => api.post('/prompts', data),
  
  // Update prompt
  update: (id: string, data: Record<string, unknown>) => api.put(`/prompts/${id}`, data),
  
  // Delete prompt
  delete: (id: string) => api.delete(`/prompts/${id}`),
};

// ========================================
// AVAILABILITY API
// ========================================
export const availabilityAPI = {
  // Check availability
  check: (params: {
    doctorId?: string;
    date: string;
    assignedPhoneNumber?: string;
  }) => api.get('/availability', { params }),
  
  // Book appointment
  book: (data: {
    doctorId: string;
    date: string;
    time: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    purpose?: string;
    notes?: string;
  }) => api.post('/availability/book', data),
  
  // Cancel appointment
  cancel: (data: {
    appointmentId: string;
    reason?: string;
  }) => api.post('/availability/cancel', data),
  
  // Set doctor leave
  setLeave: (data: {
    doctorId: string;
    date: string;
    isOnLeave: boolean;
    reason?: string;
  }) => api.post('/availability/leave', data),
  
  // Update working hours
  updateWorkingHours: (data: {
    doctorId: string;
    date: string;
    workingHours: { start: string; end: string };
    blockedTimes?: Array<{ start: string; end: string; reason?: string }>;
  }) => api.put('/availability/working-hours', data),
};

// ========================================
// CALENDAR API (Google Calendar Integration)
// ========================================
export const calendarAPI = {
  // Get OAuth URL to connect calendar
  connect: (doctorId: string) => api.get(`/calendar/connect/${doctorId}`),
  
  // Get OAuth URL to connect calendar (alias)
  getConnectUrl: (doctorId: string) => api.get(`/calendar/connect/${doctorId}`),
  
  // Check calendar connection status
  getStatus: (doctorId: string) => api.get(`/calendar/status/${doctorId}`),
  
  // Disconnect calendar
  disconnect: (doctorId: string) => api.post(`/calendar/disconnect/${doctorId}`),
  
  // Sync availability from calendar
  syncAvailability: (doctorId: string, date: string) => 
    api.get(`/calendar/sync/${doctorId}/${date}`),
};

export default api;
