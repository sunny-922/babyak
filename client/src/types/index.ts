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
  meetingTime?: string;
  meeting_time?: string;
  maxPeople?: number;
  max_people?: number;
  createdAt: string;
  created_at: string;
  creatorId?: number;
  creator_id?: number;
  creator?: { nickname: string };
  creator_nickname?: string;
  status: 'open' | 'closed';
}

export interface Application {
  id: number;
  pot_id: number;
  potId: number;
  user_id: number;
  nickname: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  createdAt: string;
  user: {
    nickname: string;
  };
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

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  potId: number;
  userId: number;
  user: { nickname: string };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}