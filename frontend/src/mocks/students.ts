import { Student, User } from '@/shared/models';

export const students: User[] = [
  {
    id: '1',
    role: 'STUDENT',
    name: 'Argel',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
  },
  {
    id: '2',
    role: 'STUDENT',
    name: 'José',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
  },
  {
    id: '3',
    role: 'STUDENT',
    name: 'Hélio',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
  },
  {
    id: '4',
    role: 'STUDENT',
    name: 'Cobalto',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
  },
  {
    id: '5',
    role: 'STUDENT',
    name: 'Alumínio',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
  },
  {
    id: '6',
    role: 'STUDENT',
    name: 'Maria Souza',
    email: 'maria.souza@aluno.ufal.br',
    avatarUrl: '',
  },
];

export const loggedUser: User = {
  id: '10',
  role: 'STUDENT',
  name: 'Pedro Sebastião',
  email: 'pedro.sebastiao@foufal.ufal.br',
  avatarUrl: '',
};

export const allowedStudents: Student[] = [
  {
    id: '1',
    role: 'STUDENT',
    name: 'Argel',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
    clinicNumber: 5,
    enrollmentCode: 1321432,
    enrollmentSemester: 8,
    enrollmentYear: 2022,
  },
  {
    id: '2',
    role: 'STUDENT',
    name: 'José',
    email: 'abc@def.ufal.br',
    avatarUrl: '',
    clinicNumber: 1,
    enrollmentCode: 1321477,
    enrollmentSemester: 5,
    enrollmentYear: 2023,
  },
];
