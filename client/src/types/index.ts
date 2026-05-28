export interface User {
  id: number;
  username: string;
  nickname: string;
  studentNumber: string;
}

export interface Pot {
  id: number;
  title: string;
  description: string;
  place: string;
  meeting_time: string;
  max_people: number;
  creator_id: number;
  creator_nickname: string;
  status: 'open' | 'closed';
}

export interface Application {
  id: number;
  pot_id: number;
  user_id: number;
  nickname: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
}

export interface Vote {
  id: number;
  potId: number;
  title: string;
  type: string;
  createdBy: number;
  createdAt: string;
  options: VoteOption[];
}

export interface VoteOption {
  id: number;
  voteId: number;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}