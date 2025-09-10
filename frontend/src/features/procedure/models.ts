export type procedureStatus =
  | 'draft'
  | 'not_started'
  | 'in_progress'
  | 'in_review'
  | 'finished';
export type reviewStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type SupervisorReview = {
  note: string;
  grade: number;
  status: reviewStatus;
};

export type Supervisor = {
  id: string;
  email: string;
  name: string;
  specialty: string;
  siape: string;
  avatarUrl: string;
};

export type SupervisorAndReview = Supervisor & {
  lastReview: SupervisorReview;
};
