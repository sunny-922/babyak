import { api } from './fetchInstance';
import { type ApiResponse, type Pot } from '../types';

export const getPots = (search = '', filter = '') =>
  api.get<ApiResponse<Pot[]>>(`/pots?search=${search}&filter=${filter}`);

export const getPotById = (potId: number) =>
  api.get<ApiResponse<Pot>>(`/pots/${potId}`);

export const createPot = (data: {
  title: string; description: string; place: string;
  meetingTime: string; maxPeople: number;
}) => api.post<ApiResponse<{ id: number }>>('/pots', data);

export const updatePot = (potId: number, data: Partial<Pot>) =>
  api.patch<ApiResponse<null>>(`/pots/${potId}`, data);

export const deletePot = (potId: number) =>
  api.delete<ApiResponse<null>>(`/pots/${potId}`);