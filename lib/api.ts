import axios from 'axios';
import { getDashboardQueryClient } from '@/lib/query-client';
import { invalidateDashboardResource } from '@/lib/dashboard-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const API_CACHE_TTL = 60_000;
const defaultAxiosAdapter = axios.getAdapter(axios.defaults.adapter);

const hashScope = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash.toString(36);
};

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

    const method = config.method?.toLowerCase() || 'get';
    if (method !== 'get') {
      return config;
    }

    if (
      typeof window === 'undefined' ||
      (config.responseType && config.responseType !== 'json')
    ) return config;

    const authScope = String(config.headers.Authorization || 'anonymous');
    const cacheKey = `${config.baseURL || ''}${config.url || ''}:${JSON.stringify(config.params || {})}`;
    const queryClient = getDashboardQueryClient();

    config.adapter = async (adapterConfig) => {
      const response = await queryClient.fetchQuery({
        queryKey: ["network", "axios", cacheKey, hashScope(authScope)],
        staleTime: API_CACHE_TTL,
        gcTime: 5 * 60_000,
        queryFn: () => defaultAxiosAdapter(adapterConfig),
      });
      return { ...response, config: adapterConfig };
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and auth
api.interceptors.response.use(
  (response) => {
    if (
      typeof window !== 'undefined' &&
      response.config.method?.toLowerCase() !== 'get'
    ) {
      void invalidateDashboardResource(getDashboardQueryClient(), response.config.url || '');
    }
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
  getCallRecordingUrl: (callId: string, token?: string) => {
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${API_BASE_URL}/calls/${encodeURIComponent(callId)}/recording${query}`;
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
  syncVozonCalls: (limit = 50) => {
    return api.post('/vozon-calls/sync', { limit });
  },
};

export interface AuthenticatedUser {
  selectedService?: string;
  bookingBusinessType?: string;
  bookingOnboardingComplete?: boolean;
  name?: string;
  email?: string;
  assignedPhoneNumber?: string;
  legacyPhoneFallback?: boolean;
  legacyAgentKnowledgeEnabled?: boolean;
  connectorManagementEnabled?: boolean;
}

export const authAPI = {
  getCurrentUser: () => api.get<AuthenticatedUser>('/auth/me'),
};

export const campaignsAPI = {
  getCampaigns: (params?: Record<string, string | number | undefined>) => api.get('/campaigns', { params }),
  launch: (id: string) => api.post(`/campaigns/${id}/launch`),
  pause: (id: string) => api.post(`/campaigns/${id}/pause`),
  resume: (id: string) => api.post(`/campaigns/${id}/resume`),
};

export type SheetAutomationConfig = {
  id: string;
  sheetUrl: string;
  spreadsheetId: string;
  sheetName: string;
  headerRow: number;
  phoneColumn: string;
  nameColumn: string;
  status: 'active' | 'paused' | 'error';
  timezone: string;
  windowStart: string;
  windowEnd: string;
  maxCallsPerPoll: number;
  maxAttempts: number;
  pollIntervalSeconds: number;
  lastSyncedAt?: string | null;
  lastSuccessAt?: string | null;
  lastError?: string;
  stats?: Record<string, number>;
};

export type SheetAutomationJob = {
  id: string;
  rowNumber: number;
  customerName: string;
  phoneNumber: string;
  status: string;
  disposition: string;
  callId: string;
  summary: string;
  lastError: string;
  updatedAt: string;
};

export const sheetAutomationAPI = {
  get: () => api.get<{
    success: boolean;
    data: {
      configured: boolean;
      callingConfigured: boolean;
      serviceAccountEmail: string;
      automation: SheetAutomationConfig | null;
      recentJobs: SheetAutomationJob[];
    };
  }>('/sheet-automation'),
  test: (data: Record<string, unknown>) => api.post('/sheet-automation/test', data),
  save: (data: Record<string, unknown>) => api.put('/sheet-automation', data),
  sync: () => api.post('/sheet-automation/sync'),
  pause: () => api.post('/sheet-automation/pause'),
  resume: () => api.post('/sheet-automation/resume'),
  disconnect: () => api.delete('/sheet-automation'),
};

export const voiceProviderAPI = {
  getAgents: () => api.get('/voice-agents'),
  getVoices: (params?: { language?: string; includeCustom?: boolean }) => api.get('/voices', { params }),
  updateAgentVoice: (
    agentId: string,
    data: { voiceId: string; provider?: string; model?: string | null; language?: string | null; agentName?: string }
  ) => api.put(`/voice-agents/${agentId}/voice`, data),
};

// ========================================
// DOCTORS API
// ========================================
type WorkingPeriod = { start: string; end: string };
type DoctorDaySchedule = {
  start?: string;
  end?: string;
  periods?: WorkingPeriod[];
  isWorking: boolean;
};
type DoctorWeeklySchedule = Partial<Record<
  'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday',
  DoctorDaySchedule
>>;

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
    phone2?: string;
    email?: string;
    slotDuration?: number;
    allowMultipleBookings?: boolean;
    maxPatientsPerSlot?: number;
    queueNumbering?: {
      enabled: boolean;
      newPatientStart: number;
      newPatientEnd: number;
      followUpStart: number;
      followUpEnd: number;
      overflowPrefix: number;
      overflowStart: number;
      allowOverflow: boolean;
    };
    defaultWorkingHours?: { start: string; end: string };
    defaultWorkingPeriods?: WorkingPeriod[];
    workingDays?: number[];
    weeklySchedule?: DoctorWeeklySchedule | null;
    defaultBlockedTimes?: Array<{ start: string; end: string; reason: string }>;
    calendarId?: string;
  }) => api.post('/doctors', data),

  // Update doctor
  update: (id: string, data: Partial<{
    name: string;
    specialization: string;
    phone: string;
    phone2: string;
    email: string;
    slotDuration: number;
    allowMultipleBookings: boolean;
    maxPatientsPerSlot: number;
    queueNumbering: {
      enabled: boolean;
      newPatientStart: number;
      newPatientEnd: number;
      followUpStart: number;
      followUpEnd: number;
      overflowPrefix: number;
      overflowStart: number;
      allowOverflow: boolean;
    };
    defaultWorkingHours: { start: string; end: string };
    defaultWorkingPeriods: WorkingPeriod[];
    workingDays: number[];
    weeklySchedule: DoctorWeeklySchedule | null;
    defaultBlockedTimes: Array<{ start: string; end: string; reason: string }>;
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
// VOICE CONNECTORS API
// ========================================
export type ConnectorProvider = 'vozon' | 'vapi' | 'retell' | 'synthflow' | 'custom';

export interface VoiceConnector {
  id: string;
  name: string;
  provider: ConnectorProvider;
  status: 'active' | 'revoked';
  externalAgentId?: string | null;
  externalAgentName?: string | null;
  externalPhoneNumberId?: string | null;
  externalPhoneNumber?: string | null;
  externalAgentMetadata?: {
    team?: string;
    status?: string;
    language?: string;
  } | null;
  tokenPrefix: string;
  permissions: string[];
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string | null;
}

interface ConnectorTokenResponse {
  success: true;
  connector: VoiceConnector;
  token: string;
  token_notice: string;
}

export const connectorsAPI = {
  list: () => api.get<{ success: true; connectors: VoiceConnector[] }>('/v1/connectors'),

  create: (data: {
    name: string;
    provider: ConnectorProvider;
    permissions?: string[];
  }) => api.post<ConnectorTokenResponse>('/v1/connectors', data),

  rotate: (id: string) =>
    api.post<ConnectorTokenResponse>(`/v1/connectors/${encodeURIComponent(id)}/rotate`),

  revoke: (id: string) =>
    api.post<{ success: true; connector: VoiceConnector }>(`/v1/connectors/${encodeURIComponent(id)}/revoke`),
};

export interface AgentKnowledgeConnection {
  connectorId: string;
  connectorName: string;
  agentName: string;
  phoneNumber?: string | null;
  available: boolean;
  instructions: string;
  promptField?: string | null;
  agentUpdatedAt?: string | null;
}

export const agentKnowledgeAPI = {
  list: (fresh = false) => api.get<{ success: true; connections: AgentKnowledgeConnection[] }>(
    '/agent-knowledge',
    fresh ? { params: { refresh: Date.now() } } : undefined
  ),
  update: (connectorId: string, instructions: string) =>
    api.put<{ success: true; connection: AgentKnowledgeConnection; message: string }>(
      `/agent-knowledge/${encodeURIComponent(connectorId)}`,
      { instructions }
    ),
};

// ========================================
// DOCTOR + WHATSAPP API
// ========================================
export const doctorWhatsappAPI = {
  getConversations: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/doctor-whatsapp/conversations', { params }),

  getMessages: (phone: string, params: { metaPhoneNumberId: string; page?: number; limit?: number }) =>
    api.get(`/doctor-whatsapp/conversations/${encodeURIComponent(phone)}/messages`, { params }),

  getMorningFollowup: () => api.get('/doctor-whatsapp/morning-followup'),

  saveMorningFollowup: (data: {
    enabled: boolean;
    templateName: string;
    templateLanguage: string;
    sendTime: string;
    variables: string[];
  }) => api.put('/doctor-whatsapp/morning-followup', data),

  getMediaUrl: (mediaId: string) => {
    const base = api.defaults.baseURL || '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${base}/doctor-whatsapp/media/${encodeURIComponent(mediaId)}${query}`;
  },
};

// ========================================
// PROMPTS API
// ========================================
export const promptsAPI = {
  // Get current authenticated user's prompt/config
  getCurrent: () => api.get('/prompts'),

  // Get all prompts
  getAll: () => api.get('/prompts'),

  // Get prompt by ID
  getById: (id: string) => api.get(`/prompts/${id}`),

  // Create prompt
  create: (data: unknown) => api.post('/prompts', data),

  // Save current authenticated user's prompt/config
  saveCurrent: (data: unknown) => api.post('/prompts', data),

  // Update prompt
  update: (id: string, data: unknown) => api.put(`/prompts/${id}`, data),

  // Update prompt by assigned phone number
  updateByPhone: (phoneNumber: string, data: unknown) => api.put(`/prompts/${phoneNumber}`, data),

  // Delete prompt
  delete: (id: string) => api.delete(`/prompts/${id}`),
};

// ========================================
// CUSTOM LLM CLINIC CONFIG API
// ========================================
export const clinicConfigAPI = {
  // Get current authenticated user's Custom LLM clinic config
  getCurrent: () => api.get('/clinic-config'),

  // Save current authenticated user's Custom LLM clinic config
  saveCurrent: (data: unknown) => api.post('/clinic-config', data),
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
    patientType?: 'new' | 'follow_up';
    patient_type?: 'new' | 'follow_up';
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
      workingPeriods?: WorkingPeriod[];
      blockedTimes?: Array<{ start: string; end: string; reason?: string }>;
    }) => api.put('/availability/working-hours', data),

    // Remove one manually blocked doctor period
    unblockTime: (data: {
      doctorId: string;
      date: string;
      startTime: string;
      endTime: string;
      reason: string;
    }) => api.post('/availability/unblock-time', data),
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
    location?: string;
    patientType?: 'new' | 'follow_up';
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

  // Create or retrieve a doctor's stable public appointment link
  getDisplayLink: (doctorId: string) =>
    api.post(`/appointments/display-links/${doctorId}`),
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
// TANKRO API
// ========================================
export const tankroAPI = {
  getDefaults: () => api.get('/tankro/defaults'),

  getSummary: () => api.get('/tankro/summary'),

  getLocations: (params?: { active?: boolean; search?: string }) =>
    api.get('/tankro/locations', { params }),

  seedDefaultLocations: () => api.post('/tankro/locations/seed-defaults'),

  createLocation: (data: {
    name: string;
    district: string;
    address?: string;
    contactPhone?: string;
    email?: string;
    slotDuration?: number;
    allowMultipleBookings?: boolean;
    maxBookingsPerSlot?: number;
    defaultWorkingHours?: { start: string; end: string };
    workingDays?: number[];
    calendarId?: string;
    active?: boolean;
  }) => api.post('/tankro/locations', data),

  updateLocation: (id: string, data: Partial<{
    name: string;
    district: string;
    address: string;
    contactPhone: string;
    email: string;
    slotDuration: number;
    allowMultipleBookings: boolean;
    maxBookingsPerSlot: number;
    defaultWorkingHours: { start: string; end: string };
    workingDays: number[];
    calendarId: string;
    active: boolean;
  }>) =>
    api.put(`/tankro/locations/${id}`, data),

  deleteLocation: (id: string) => api.delete(`/tankro/locations/${id}`),

  getBookings: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    locationId?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
  }) => api.get('/tankro/bookings', { params }),

  createBooking: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    city?: string;
    area?: string;
    landmark?: string;
    locationId: string;
    propertyType?: string;
    serviceType?: string;
    tankCapacityLitres?: number;
    jarQuantity?: number;
    route?: string;
    date: string;
    time: string;
    notes?: string;
  }) => api.post('/tankro/bookings', data),

  updateBooking: (id: string, data: Record<string, unknown>) =>
    api.put(`/tankro/bookings/${id}`, data),

  deleteBooking: (id: string) => api.delete(`/tankro/bookings/${id}`),

  checkAvailability: (params: {
    assignedPhoneNumber: string;
    locationId?: string;
    locationName?: string;
    district?: string;
    date: string;
  }) => api.get('/tankro/availability', { params }),

  getSessions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    state?: string;
    district?: string;
    search?: string;
  }) => api.get('/tankro/sessions', { params }),

  getSession: (id: string) => api.get(`/tankro/sessions/${id}`),

  sendSessionMessage: (id: string, message: string) =>
    api.post(`/tankro/sessions/${id}/send-message`, { message }),
};

export const tankroCalendarAPI = {
  connect: (locationId: string) => api.get(`/tankro/calendar/connect/${locationId}`),
  getStatus: (locationId: string) => api.get(`/tankro/calendar/status/${locationId}`),
  disconnect: (locationId: string) => api.post(`/tankro/calendar/disconnect/${locationId}`),
  syncAvailability: (locationId: string, date: string) =>
    api.get(`/tankro/calendar/sync/${locationId}/${date}`),
};
// ========================================
// EVENT BOOKING CRM API
// ========================================
export const eventBookingAPI = {
  getTools: () => api.get('/events/tools'),
  getSummary: () => api.get('/events/summary'),
  getVenues: (params?: { active?: boolean; search?: string }) => api.get('/events/venues', { params }),
  seedDefaultVenue: () => api.post('/events/venues/seed-default'),
  createVenue: (data: {
    name: string;
    city?: string;
    address?: string;
    contactPhone?: string;
    email?: string;
    slotDuration?: number;
    allowMultipleBookings?: boolean;
    maxBookingsPerSlot?: number;
    defaultWorkingHours?: { start: string; end: string };
    workingDays?: number[];
    active?: boolean;
  }) => api.post('/events/venues', data),
  updateVenue: (id: string, data: Partial<{
    name: string;
    city: string;
    address: string;
    contactPhone: string;
    email: string;
    slotDuration: number;
    allowMultipleBookings: boolean;
    maxBookingsPerSlot: number;
    defaultWorkingHours: { start: string; end: string };
    workingDays: number[];
    active: boolean;
  }>) => api.put(`/events/venues/${id}`, data),
  deleteVenue: (id: string) => api.delete(`/events/venues/${id}`),
  getBookings: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    venueId?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
  }) => api.get('/events/bookings', { params }),
  createBooking: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    eventType: string;
    eventDate: string;
    eventTime: string;
    guestCount?: number;
    budget?: number;
    packageName?: string;
    venueId?: string;
    venueName?: string;
    city?: string;
    notes?: string;
    specialRequirements?: string;
  }) => api.post('/events/bookings', data),
  updateBooking: (id: string, data: Record<string, unknown>) => api.put(`/events/bookings/${id}`, data),
  deleteBooking: (id: string) => api.delete(`/events/bookings/${id}`),
  checkAvailability: (params: {
    assignedPhoneNumber: string;
    eventDate: string;
    eventTime?: string;
    venueId?: string;
    venueName?: string;
    city?: string;
  }) => api.get('/events/availability', { params }),
};

export const bookingCrmAPI = {
  getTools: () => api.get('/booking-crm/tools'),
  getOverview: () => api.get('/booking-crm/overview'),
  getProfile: () => api.get('/booking-crm/profile'),
  completeOnboarding: (data: { businessType: string; businessName?: string }) => api.post('/booking-crm/onboarding', data),
  updateProfile: (data: Record<string, unknown>) => api.put('/booking-crm/profile', data),
  getServices: () => api.get('/booking-crm/services'),
  createService: (data: Record<string, unknown>) => api.post('/booking-crm/services', data),
  updateService: (id: string, data: Record<string, unknown>) => api.put('/booking-crm/services/' + id, data),
  getResources: () => api.get('/booking-crm/resources'),
  createResource: (data: Record<string, unknown>) => api.post('/booking-crm/resources', data),
  updateResource: (id: string, data: Record<string, unknown>) => api.put('/booking-crm/resources/' + id, data),
  getBookings: (params?: Record<string, string | number | undefined>) => api.get('/booking-crm/bookings', { params }),
  createBooking: (data: Record<string, unknown>) => api.post('/booking-crm/bookings', data),
  updateBooking: (id: string, data: Record<string, unknown>) => api.put('/booking-crm/bookings/' + id, data),
  getCustomers: () => api.get('/booking-crm/customers'),
  checkAvailability: (data: Record<string, unknown>) => api.post('/booking-crm/availability', data),
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

  // Get every phone number that has messaged the bot (including greeting-only users)
  getContacts: (params?: {
    location?: string;
    service?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/healthiqure/contacts', { params }),

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

  // Send verified WhatsApp template message
  sendTemplateMessage: (data: {
    phone: string;
    templateName: string;
    language?: string;
    parameters?: string[];
    hospitalName?: string;
    doctorName?: string;
  }) => api.post('/healthiqure/send-template-message', data),

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
  getTemplates: (params?: { language?: string; search?: string; type?: string }) =>
    api.get('/templates', { params }),

  createTemplate: (data: { name: string; language?: string; type?: string; message: string }) =>
    api.post('/templates', data),

  updateTemplate: (id: string, data: { name?: string; language?: string; type?: string; message?: string }) =>
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
    historyLimit?: number;
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
    createdAfter?: string;
  }) => api.get('/akiara/tickets', { params }),

  // Get single ticket
  getTicket: (id: string) => api.get(`/akiara/tickets/${id}`),

  // Update ticket (status, priority, assignedTo)
  updateTicket: (id: string, data: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  }) => api.patch(`/akiara/tickets/${id}`, data),

  // Create a new ticket manually from dashboard
  createTicket: (data: {
    phone: string;
    orderId?: string;
    product?: string;
    issueCategory?: string;
    issueDescription: string;
    priority?: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    customerCity?: string;
    customerState?: string;
    customerPincode?: string;
    purchaseDate?: string;
    purchasePlatform?: string;
    serviceType?: string;
    tags?: string[];
  }) => api.post('/akiara/tickets', data),

  // Get analytics
  getAnalytics: (params?: { days?: number }) =>
    api.get('/akiara/analytics', { params }),

  // Send message to customer
  sendMessage: (data: { phone: string; message: string; tenantId: string }) =>
    api.post('/akiara/send-message', data),

  // Get tenant message templates
  getMessageTemplates: (params: { tenantId: string }) =>
    api.get('/akiara/message-templates', { params }),

  // Send a rendered tenant template to a customer
  sendTemplateMessage: (data: {
    phone: string;
    tenantId: string;
    templateId: string;
    variables?: Record<string, string>;
  }) => api.post('/akiara/send-template-message', data),

  // Send a rendered tenant template to multiple customers
  sendBulkTemplateMessage: (data: {
    phones: string[];
    tenantId: string;
    templateId: string;
    variables?: Record<string, string>;
  }) => api.post('/akiara/send-bulk-template-message', data),

  // Get bulk campaign progress
  getBulkCampaign: (id: string, params?: { tenantId?: string }) =>
    api.get(`/akiara/bulk-campaigns/${id}`, { params: { ...params, _ts: Date.now() } }),

  // Get dashboard message history
  getMessageHistory: (params: {
    tenantId: string;
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    templateId?: string;
  }) => api.get('/akiara/message-history', { params }),

  // Delete message history entry
  deleteMessageHistory: (id: string) =>
    api.delete(`/akiara/message-history/${id}`),

  // Resolve customer media URL — handles proxy IDs and old Meta URLs
  getMediaUrl: (url: string): string => {
    if (!url) return '';
    const base = api.defaults.baseURL || '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    let tenantId = '';
    if (typeof window !== 'undefined') {
      try {
        tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || '';
      } catch {
        tenantId = '';
      }
    }
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (tenantId) params.set('tenantId', tenantId);
    const query = params.toString();

    if (url.startsWith('__media_id__:')) {
      const mediaId = url.replace('__media_id__:', '');
      return `${base}/akiara/media/${encodeURIComponent(mediaId)}${query ? `?${query}` : ''}`;
    }
    // Old Meta URLs contain mid=<mediaId> — extract and route through proxy (lazy recovery)
    if (url.includes('fbsbx.com') || url.includes('facebook.com')) {
      try {
        const u = new URL(url);
        const mid = u.searchParams.get('mid');
        if (mid) return `${base}/akiara/media/${encodeURIComponent(mid)}${query ? `?${query}` : ''}`;
      } catch { /* invalid URL */ }
      return '';
    }
    return url;
  },
};

// ========================================
// VISIVA BOT API (Valeria Admissions WhatsApp Agent)
// ========================================
export const visivaBotAPI = {
  getSessions: (params?: {
    state?: string;
    interestLevel?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/visiva-bot/sessions', { params }),

  getSession: (phone: string) => api.get(`/visiva-bot/sessions/${phone}`),

  resetSession: (phone: string) => api.post(`/visiva-bot/sessions/${phone}/reset`),

  getLeads: (params?: {
    status?: string;
    interestLevel?: string;
    program?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/visiva-bot/leads', { params }),

  updateLead: (id: string, data: {
    status?: string;
    interestLevel?: string;
    assignedTo?: string;
    adminContacted?: boolean;
    tags?: string[];
  }) => api.patch(`/visiva-bot/leads/${id}`, data),

  markLeadContacted: (id: string) => api.patch(`/visiva-bot/leads/${id}/contacted`),

  getAnalytics: (params?: { days?: number }) => api.get('/visiva-bot/analytics', { params }),

  sendMessage: (data: { phone: string; message: string }) =>
    api.post('/visiva-bot/send-message', data),

  getTemplates: (params?: { search?: string; active?: boolean }) =>
    api.get('/visiva-bot/templates', { params }),

  createTemplate: (data: {
    name: string;
    templateId?: string;
    language?: string;
    body: string;
    variables?: Array<{ key: string; label: string; required?: boolean; defaultValue?: string }>;
    active?: boolean;
  }) => api.post('/visiva-bot/templates', data),

  updateTemplate: (id: string, data: {
    name: string;
    templateId?: string;
    language?: string;
    body: string;
    variables?: Array<{ key: string; label: string; required?: boolean; defaultValue?: string }>;
    active?: boolean;
  }) => api.put(`/visiva-bot/templates/${id}`, data),

  deleteTemplate: (id: string) => api.delete(`/visiva-bot/templates/${id}`),

  sendTemplateMessage: (data: {
    phone: string;
    templateId: string;
    variables?: Record<string, string>;
  }) => api.post('/visiva-bot/send-template-message', data),

  getMessageHistory: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    templateId?: string;
  }) => api.get('/visiva-bot/message-history', { params }),

  deleteMessageHistory: (id: string) => api.delete(`/visiva-bot/message-history/${id}`),

  getMediaUrl: (marker: string): string => {
    if (!marker) return '';
    const base = api.defaults.baseURL || '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    if (marker.startsWith('__visiva_media_id__:')) {
      const mediaId = marker.replace('__visiva_media_id__:', '');
      return `${base}/visiva-bot/media/${encodeURIComponent(mediaId)}${query}`;
    }
    return marker;
  },
};

// ========================================
// TENANT CONFIG API
// ========================================
export const tenantAPI = {
  // Get all tenants
  getTenants: () => api.get('/tenants'),

  // Get single tenant
  getTenant: (tenantId: string) => api.get(`/tenants/${tenantId}`),

  // Update tenant config (including TeleCRM settings)
  updateTenant: (tenantId: string, data: Record<string, unknown>) =>
    api.put(`/tenants/${tenantId}`, data),
};

export default api;
