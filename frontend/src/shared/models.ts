export type Pacient = {
  id: number;
  avatarUrl: string;
  name: string
  lastModified: Date;
  assignee: Student;
  status: 'draft' | 'not_started' | 'in_progress' | 'finished';
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
