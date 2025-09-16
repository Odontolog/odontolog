import { procedureStatus } from "@/features/procedure/models";

export type Patient = {
  id: number;
  avatarUrl: string;
  name: string;
  lastModified: Date;
  assignee: Student;
  status: procedureStatus;
};

type User = {
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
