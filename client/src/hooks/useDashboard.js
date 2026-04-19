import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export const useDashboard = () => useQuery({ queryKey: ['bootstrap'], queryFn: async () => (await api.get('/bootstrap')).data });

export const useDashboardActions = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['bootstrap'] });

  const createExperience = useMutation({ mutationFn: (payload) => api.post('/experiences', payload), onSuccess: invalidate });
  const updateExperience = useMutation({ mutationFn: ({ id, payload }) => api.put(`/experiences/${id}`, payload), onSuccess: invalidate });
  const deleteExperience = useMutation({ mutationFn: (id) => api.delete(`/experiences/${id}`), onSuccess: invalidate });
  const saveSchedule = useMutation({ mutationFn: (payload) => payload.id ? api.put(`/personal-schedules/${payload.id}`, payload) : api.post('/personal-schedules', payload), onSuccess: invalidate });
  const deleteSchedule = useMutation({ mutationFn: (id) => api.delete(`/personal-schedules/${id}`), onSuccess: invalidate });
  const markNotification = useMutation({ mutationFn: ({ id, read }) => api.patch(`/notifications/${encodeURIComponent(id)}`, { read }), onSuccess: invalidate });

  return { createExperience, updateExperience, deleteExperience, saveSchedule, deleteSchedule, markNotification };
};
