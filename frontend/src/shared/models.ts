export type Patient = {
  id: number;
  avatarUrl: string;
  name: string;
  lastModified: Date;
};

export type User = {
  id: string;
  role: 'student' | 'supervisor' | 'admin';
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Student = User & {
  clinic: number;
  enrollment: number;
  semester: number;
};

export type Supervisor = User & {
  specialty: string;
  siape: string;
};

type ActivityType =
  | 'created'
  | 'edited'
  | 'review_requested'
  | 'review_approved'
  | 'review_rejected'
  | 'completed';

export type Activity = {
  id: string;
  type: ActivityType;
  actor: Supervisor | Student;
  metadata?: Record<string, any>;
  createdAt: Date;
};

export type Review = {
  id: string;
  note: string;
  grade: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  supervisor: Supervisor;
};

// ReviewablePants
export type Reviewable = {
  id: string;
  author: Supervisor | Student;
  assignee?: Supervisor | Student;
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
  notes: string;
  history: Activity[];
  type: 'treatment_plan' | 'procedure';
  status: 'not_started' | 'in_progress' | 'in_review' | 'finished';
};

export interface HasReviewable {
  reviewable: Reviewable;
  reviewableId: string;
}

export type Attachments = {
  url: string;
  filename: string;
  uploader: Supervisor | Student;
  size: number;
};

export type ProcedureDetail = {
  diagnostic: string;
};

// ReviewablePants
export type Procedure = {
  id: string;
  attachments: Attachments[];
  studySector: string;
  tooth: string[];
  details: ProcedureDetail;
  reviewableId: string;
  reviewable: Reviewable;
  type: 'pre_procedure' | 'tratment_plan_procedure';
};

// PreProcedurePants
export type PreProcedure = Procedure;

// TreatmentPlanProcedurePants
export type TreatmentPlanProcedure = Procedure & {
  treatmentPlanId: string;
};

export type ReviewableShort = {
  id: string;
  assignee: Supervisor | Student;
  updatedAt: Date;
  notes: string;
  status: 'not_started' | 'in_progress' | 'in_review' | 'finished';
};

export type TreatmentPlanProcedureShort = {
  id: string;
  studySector: string;
  tooth: string[];
  treatmentPlanId: string;
  reviewable: ReviewableShort;
};

export type TreatmentPlan = {
  id: string;
  status: 'draft' | 'pending' | 'active' | 'completed';
  procedures: TreatmentPlanProcedureShort[];
  reviewableId: string;
  reviewable: Reviewable;
};
