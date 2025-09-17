export type PatientShort = {
  id: number;
  avatarUrl: string;
  name: string;
};

export type User = {
  id: string;
  role: 'student' | 'supervisor' | 'admin';
  name: string;
  email: string;
  avatarUrl: string;
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

export type ActivityType =
  | 'created'
  | 'edited'
  | 'review_requested'
  | 'review_approved'
  | 'review_rejected'
  | 'completed';

export type Activity = {
  id: string;
  type: ActivityType;
  actor: User;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
};

export type Review = {
  id: string;
  note: string;
  grade: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  supervisor: User;
};

export type ProcedureStatus =
  | 'draft'
  | 'not_started'
  | 'in_progress'
  | 'in_review'
  | 'done';

export type ProcedureShort = {
  id: string;
  status: ProcedureStatus;
  name: string;
  studySector: string;
  plannedSession: number;
  assignee: User;
  patient: PatientShort;
  teeth: string[];
  updatedAt: Date;
  reviews: Review[];
  notes: string;
  procedureType: 'treatment_plan_procedure' | 'pre_procedure';
};

export type TreatmentPlanStatus =
  | 'draft'
  | 'in_review'
  | 'in_progress'
  | 'done';

export type TreatmentPlanShort = {
  id: string;
  status: TreatmentPlanStatus;
  assignee: User;
  patient: PatientShort;
  updatedAt: Date;
  notes: string;
  type: 'treatment_plan' | 'procedure';
};

export type Reviewable = {
  id: string;
  author: User;
  assignee: User;
  patient: PatientShort;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  reviews: Review[];
  history: Activity[];
  type: 'treatment_plan' | 'procedure';
};

export type TreatmentPlan = Reviewable & {
  id: string;
  status: TreatmentPlanStatus;
  procedures: ProcedureShort[];
};

export type Attachments = {
  id: string;
  url: string;
  filename: string;
  uploader: User;
  size: number;
};

export type ProcedureDetail = {
  diagnostic: string;
};

export type Procedure = Reviewable & {
  id: string;
  status: ProcedureStatus;
  name: string;
  attachments: Attachments[];
  studySector: string;
  teeth: string[];
  details: ProcedureDetail;
  procedureType: 'pre_procedure' | 'tratment_plan_procedure';
  treatmentPlanId?: string;
};
