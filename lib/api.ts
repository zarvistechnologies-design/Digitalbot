import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';

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
        console.log('🔒 Authentication failed:', error.response?.data?.message || error.response?.data?.error);

        // Only redirect to login if token is missing or explicitly invalid
        // Don't redirect for "no phone number assigned" errors
        const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
        const shouldRedirect = errorMessage.includes('invalid token') ||
                              errorMessage.includes('jwt') ||
                              errorMessage.includes('Token') ||
                              errorMessage.includes('Unauthorized') ||
                              !localStorage.getItem('token');

        if (shouldRedirect && !window.location.pathname.includes('/login')) {
          console.log('🔒 Clearing invalid session, redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
// APPOINTMENTS API
// ========================================
export const appointmentsAPI = {
  // Get all appointments
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
    phone?: string;
    source?: string;
  }) => api.get('/appointments', { params }),

  // Get appointment by ID
  getById: (id: string) => api.get(`/appointments/${id}`),

  // Create appointment manually
  create: (data: {
    name: string;
    phone: string;
    reason?: string;
    date: string;
    time: string;
    notes?: string;
    doctorName?: string;
    doctorId?: string;
  }) => api.post('/appointments', data),

  // Update appointment
  update: (id: string, data: Record<string, unknown>) => api.put(`/appointments/${id}`, data),

  // Get calendar appointments
  getCalendar: (year: number, month: number) =>
    api.get('/appointments/calendar', { params: { year, month } }),

  // Get stats summary
  getStats: () => api.get('/appointments/stats/summary'),
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

// ========================================
// HEALTHIQURE BOT API
// ========================================
export const healthiqureAPI = {
  // Get all bot sessions
  getSessions: (params?: {
    state?: string;
    location?: string;
    service?: string;
    page?: number;
    limit?: number;
  }) => api.get('/healthiqure/sessions', { params }),

  // Get single session by phone
  getSession: (phone: string) => api.get(`/healthiqure/sessions/${phone}`),

  // Get sessions with documents (mediaUrls)
  getDocuments: (params?: {
    location?: string;
    service?: string;
    page?: number;
    limit?: number;
  }) => api.get('/healthiqure/sessions/documents/all', { params }),

  // Fetch media blob from backend proxy (uses Authorization header via axios interceptor)
  getMediaBlob: (mediaId: string) =>
    api.get(`/healthiqure/media/${encodeURIComponent(mediaId)}`, { responseType: 'blob' }),

  // Get bot analytics/stats
  getAnalytics: (params?: {
    days?: number;
  }) => api.get('/healthiqure/analytics', { params }),

  // Send confirmation — Doctor consultation
  confirmAppointment: (data: {
    phone: string;
    doctorName: string;
    date: string;
    time: string;
    consultationType?: string;
    videoCallNumber?: string;
    location?: string;
  }) => api.post('/healthiqure/confirm-appointment', data),

  // Send confirmation — Pharmacy ready
  confirmPharmacy: (data: { phone: string }) =>
    api.post('/healthiqure/pharmacy-ready', data),

  // Send confirmation — Lab test
  confirmLab: (data: {
    phone: string;
    date: string;
    time: string;
    location?: string;
  }) => api.post('/healthiqure/confirm-lab', data),

  // Send confirmation — ECG
  confirmEcg: (data: {
    phone: string;
    date: string;
    time: string;
    location?: string;
  }) => api.post('/healthiqure/confirm-ecg', data),

  // Send confirmation — Ultrasound
  confirmUltrasound: (data: {
    phone: string;
    date: string;
    time: string;
    ultrasoundType?: string;
    location?: string;
  }) => api.post('/healthiqure/confirm-ultrasound', data),

  // Send confirmation — Skin
  confirmSkin: (data: {
    phone: string;
    date: string;
    time: string;
    location?: string;
  }) => api.post('/healthiqure/confirm-skin', data),

  // Send confirmation — Hospital admission
  confirmHospital: (data: {
    phone: string;
    registrationNo?: string;
    hospitalName: string;
    hospitalAddress?: string;
    contactPerson?: string;
    contactNumber?: string;
    attendingDoctor?: string;
    spocNumber?: string;
  }) => api.post('/healthiqure/confirm-hospital', data),

  // Send confirmation — Partner location
  confirmPartner: (data: {
    phone: string;
    service?: string;
    locationName: string;
    address?: string;
    contactPerson?: string;
    date: string;
    time: string;
  }) => api.post('/healthiqure/confirm-partner', data),

  // Send custom message
  sendMessage: (data: {
    phone: string;
    message: string;
  }) => api.post('/healthiqure/send-message', data),

  // Reset session
  resetSession: (phone: string) => api.post('/healthiqure/reset-session', { phone }),

  // Get bot leads (sessions with service selected)
  getLeads: (params?: {
    location?: string;
    service?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }) => api.get('/healthiqure/leads', { params }),

  // Mark lead as contacted (supports historyId for archived queries)
  markContacted: (phone: string, historyId?: string) =>
    api.patch(`/healthiqure/leads/${phone}/contacted${historyId ? `?historyId=${historyId}` : ''}`),

  // Send bulk message to multiple recipients
  sendBulkMessage: (data: {
    phones: string[];
    message: string;
  }) => api.post('/healthiqure/send-bulk-message', data),

  // Send quick message with optional document
  sendQuickMessage: (formData: FormData) =>
    api.post('/healthiqure/send-quick-message', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get message history
  getMessageHistory: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    hospitalName?: string;
    doctorName?: string;
  }) => api.get('/healthiqure/message-history', { params }),

  // Delete message history entry
  deleteMessageHistory: (id: string) =>
    api.delete(`/healthiqure/message-history/${id}`),

  // Get notification numbers
  getNotificationNumbers: () =>
    api.get('/healthiqure/notification-numbers'),

  // Update notification numbers
  setNotificationNumbers: (numbers: string[]) =>
    api.put('/healthiqure/notification-numbers', { numbers }),
};

// ========================================
// TEMPLATE API
// ========================================
export const templateAPI = {
  getTemplates: (params?: { language?: string; search?: string }) =>
    api.get('/templates', { params }),

  createTemplate: (data: { name: string; language?: string; message: string }) =>
    api.post('/templates', data),

  updateTemplate: (id: string, data: { name?: string; language?: string; message?: string }) =>
    api.put(`/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    api.delete(`/templates/${id}`),
};

// ========================================
// AKIARA BOT API (Devika WhatsApp Agent)
// ========================================
export const akiaraAPI = {
  // Get all bot sessions
  getSessions: (params?: {
    state?: string;
    product?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/akiara/sessions', { params }),

  // Get single session by phone
  getSession: (phone: string) => api.get(`/akiara/sessions/${phone}`),

  // Get all tickets
  getTickets: (params?: {
    status?: string;
    priority?: string;
    product?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/akiara/tickets', { params }),

  // Get single ticket
  getTicket: (id: string) => api.get(`/akiara/tickets/${id}`),

  // Update ticket (status, priority, assignedTo)
  updateTicket: (id: string, data: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  }) => api.patch(`/akiara/tickets/${id}`, data),

  // Get analytics
  getAnalytics: (params?: { days?: number }) =>
    api.get('/akiara/analytics', { params }),

  // Send message to customer
  sendMessage: (data: { phone: string; message: string }) =>
    api.post('/akiara/send-message', data),

  // Resolve customer media URL — handles proxy IDs and old Meta URLs
  getMediaUrl: (url: string): string => {
    if (!url) return '';
    const base = api.defaults.baseURL || '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    if (url.startsWith('__media_id__:')) {
      const mediaId = url.replace('__media_id__:', '');
      return `${base}/akiara/media/${mediaId}?token=${token}`;
    }
    // Old Meta URLs contain mid=<mediaId> — extract and route through proxy (lazy recovery)
    if (url.includes('fbsbx.com') || url.includes('facebook.com')) {
      try {
        const u = new URL(url);
        const mid = u.searchParams.get('mid');
        if (mid) return `${base}/akiara/media/${mid}?token=${token}`;
      } catch { /* invalid URL */ }
      return '';
    }
    return url;
  },
};

export default api;
