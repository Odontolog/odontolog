export type SupervisorReview = {
  note: string;
  grade: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
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
