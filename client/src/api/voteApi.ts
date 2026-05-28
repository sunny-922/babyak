import { api } from './fetchInstance';
import { type ApiResponse, type Vote } from '../types';

export const getVotes = (potId: number) =>
  api.get<ApiResponse<Vote[]>>(`/pots/${potId}/votes`);

export const createVote = (potId: number, data: {
  title: string; type: string; options: string[];
}) => api.post<ApiResponse<Vote>>(`/pots/${potId}/votes`, data);

export const respondToVote = (voteId: number, optionId: number) =>
  api.post<ApiResponse<null>>(`/votes/${voteId}/responses`, { optionId });

export const getVoteResults = (voteId: number) =>
  api.get<ApiResponse<{ optionId: number; count: number }[]>>(`/votes/${voteId}/results`);