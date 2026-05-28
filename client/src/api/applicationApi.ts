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