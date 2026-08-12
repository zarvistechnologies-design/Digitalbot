import api from '@/lib/api';

export const pathologyAPI = {
  getWhatsappConfig: () => api.get('/pathology/whatsapp-config'),
  updateWhatsappConfig: (data: Record<string, unknown>) => api.put('/pathology/whatsapp-config', data),
  getOverview: () => api.get('/pathology/overview'),
  getPatients: (params?: { search?: string }) => api.get('/pathology/patients', { params }),
  getPatient: (id: string) => api.get(`/pathology/patients/${id}`),
  updatePatient: (id: string, data: Record<string, unknown>) => api.patch(`/pathology/patients/${id}`, data),
  getTests: (params?: { active?: boolean }) => api.get('/pathology/tests', { params }),
  createTest: (data: Record<string, unknown>) => api.post('/pathology/tests', data),
  updateTest: (id: string, data: Record<string, unknown>) => api.patch(`/pathology/tests/${id}`, data),
  deleteTest: (id: string) => api.delete(`/pathology/tests/${id}`),
  getOrders: (params?: Record<string, string | undefined>) => api.get('/pathology/orders', { params }),
  createOrder: (data: Record<string, unknown>) => api.post('/pathology/orders', data),
  updateOrder: (id: string, data: Record<string, unknown>) => api.patch(`/pathology/orders/${id}`, data),
  uploadReport: (id: string, file: File) => {
    const body = new FormData();
    body.append('file', file);
    return api.post(`/pathology/orders/${id}/report`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  downloadReport: (id: string) => api.get(`/pathology/orders/${id}/report`, { responseType: 'blob' }),
  sendReport: (id: string) => api.post(`/pathology/orders/${id}/send-report`),
  getReferrals: () => api.get('/pathology/referrals'),
  createReferral: (data: Record<string, unknown>) => api.post('/pathology/referrals', data),
  updateReferral: (id: string, data: Record<string, unknown>) => api.patch(`/pathology/referrals/${id}`, data),
  getConversations: (params?: { search?: string }) => api.get('/pathology/inbox/conversations', { params }),
  getMessages: (phone: string, metaPhoneNumberId?: string) => api.get(`/pathology/inbox/${encodeURIComponent(phone)}/messages`, { params: { metaPhoneNumberId } }),
  sendMessage: (phone: string, data: { message: string; patientName?: string; metaPhoneNumberId?: string }) => api.post(`/pathology/inbox/${encodeURIComponent(phone)}/messages`, data),
};
