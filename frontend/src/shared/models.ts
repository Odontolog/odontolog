export type PatientShort = {
  id: string;
  avatarUrl: string;
  name: string;
};

export type Patient = PatientShort & {
  birthDate: Date;
  phone: string;
  cpf: string;
  rg: string;
  ssp: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'CIVIL_UNION';
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  ethnicity: 'WHITE' | 'BLACK' | 'BROWN' | 'YELLOW' | 'INDIGENOUS' | 'OTHER';
  address: string;
  city: string;
  state: string;
  occupation: string;
};

export type UserRole = 'STUDENT' | 'SUPERVISOR' | 'ADMIN';

export type User = {
  id: string;
  role: UserRole;
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
  specialization: string;
  siape: string;
};

export type ActivityType =
  | 'CREATED'
  | 'EDITED'
  | 'REVIEW_REQUESTED'
  | 'REVIEW_APPROVED'
  | 'REVIEW_REJECTED'
  | 'COMPLETED';

export type Activity = {
  id: number;
  type: ActivityType;
  actor: User;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};

export type ReviewStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type Review = {
  id: string;
  note: string;
  grade: number;
  reviewStatus: ReviewStatus;
  supervisor: Supervisor;
};

export type ProcedureStatus =
  | 'DRAFT'
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'COMPLETED';

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
  type: 'TREATMENT_PLAN' | 'PROCEDURE';
  procedureType: 'TREATMENT_PLAN_PROCEDURE' | 'PRE_PROCEDURE';
};

export type TreatmentPlanStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'IN_PROGRESS'
  | 'DONE';

export type TreatmentPlanShort = {
  id: string;
  status: TreatmentPlanStatus;
  assignee: User;
  patient: PatientShort;
  updatedAt: Date;
  notes: string;
  type: 'TREATMENT_PLAN' | 'PROCEDURE';
};

export type ReviewableShort = TreatmentPlanShort | ProcedureShort;

export type Reviewable = {
  id: string;
  author: User;
  assignee: User;
  patient: PatientShort;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  reviews: Review[];
  reviewers: Supervisor[];
  history: Activity[];
  type: 'TREATMENT_PLAN' | 'PROCEDURE';
};

export type TreatmentPlan = Reviewable & {
  status: TreatmentPlanStatus;
  procedures: ProcedureShort[];
};

export type Attachments = {
  id: string;
  location: string;
  filename: string;
  uploader: User;
  size: string;
};

export type ProcedureDetail = {
  diagnostic: string;
};

export type Procedure = Reviewable & {
  status: ProcedureStatus;
  name: string;
  attachments: Attachments[];
  studySector: string;
  teeth: string[];
  procedureDetail: ProcedureDetail;
  procedureType: 'PRE_PROCEDURE' | 'TRATMENT_PLAN_PROCEDURE';
  treatmentPlanId?: string;
};

export type Mode = 'edit' | 'read';
