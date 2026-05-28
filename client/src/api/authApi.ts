import { api } from './fetchInstance';
import { type ApiResponse, type User } from '../types';

export const signup = (data: {
  username: string; password: string;
  nickname: string; studentNumber: string;
}) => api.post<ApiResponse<User>>('/auth/signup', data);

export const login = (data: { username: string; password: string }) =>
  api.post<ApiResponse<{ token: string; nickname: string }>>('/auth/login', data);

export const getMe = () => api.get<ApiResponse<User>>('/auth/me');