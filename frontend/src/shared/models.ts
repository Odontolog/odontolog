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
  description: string;
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
  assignee: Supervisor | Student;
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
  notes: string;
  history: Activity[];
  type: 'treatment_plan' | 'procedure';
  status: 'draft' | 'in_review' | 'approved';
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
  name: string;
  attachments: Attachments[];
  studySector: string;
  tooth: string[];
  details: ProcedureDetail;
  reviewableId: string;
  reviewable: Reviewable;
  type: 'pre_procedure' | 'tratment_plan_procedure';
  status: 'in_creation' | 'not_started' | 'in_progress' | 'done';
};

// PreProcedurePants
export type PreProcedure = Procedure;

// TreatmentPlanProcedurePants
export type TreatmentPlanProcedure = Procedure & {
  treatmentPlanId: string;
  plannedSession: number;
};

export type ReviewableShort = {
  id: string;
  assignee: Supervisor | Student;
  updatedAt: Date;
  notes: string;
  status: 'draft' | 'in_review' | 'approved';
};

export type TreatmentPlanProcedureShort = {
  id: string;
  name: string;
  studySector: string;
  plannedSession: number;
  tooth: string[];
  treatmentPlanId: string;
  reviewable: ReviewableShort;
  status: 'in_creation' | 'not_started' | 'in_progress' | 'done';
};

export type TreatmentPlan = {
  id: string;
  status: 'in_creation' | 'in_progress' | 'done';
  procedures: TreatmentPlanProcedureShort[];
  reviewableId: string;
  reviewable: Reviewable;
};
