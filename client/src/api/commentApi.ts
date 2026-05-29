import { api } from './fetchInstance';
import { type ApiResponse, type Comment } from '../types';

export const getComments = (potId: number) =>
  api.get<ApiResponse<Comment[]>>(`/pots/${potId}/comments`);

export const createComment = (potId: number, content: string) =>
  api.post<ApiResponse<Comment>>(`/pots/${potId}/comments`, { content });

export const deleteComment = (id: number) =>
  api.delete<ApiResponse<null>>(`/comments/${id}`);
