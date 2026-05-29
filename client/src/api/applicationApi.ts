import { api } from './fetchInstance';
import { type ApiResponse, type Application } from '../types';

export const applyToPot = (potId: number, message: string) =>
  api.post<ApiResponse<null>>(`/pots/${potId}/applications`, { message });

export const getApplications = (potId: number) =>
  api.get<ApiResponse<Application[]>>(`/pots/${potId}/applications`);

export const approveApplication = (id: number) =>
  api.patch<ApiResponse<null>>(`/applications/${id}/approve`, {});

export const rejectApplication = (id: number) =>
  api.patch<ApiResponse<null>>(`/applications/${id}/reject`, {});

export const getMyApplications = () =>
  api.get<ApiResponse<(Application & { pot: { id: number; title: string; status: string; meetingTime: string } })[]>>(`/users/me/applications`);