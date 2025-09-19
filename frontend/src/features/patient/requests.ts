import { PatientShort, TreatmentPlanStatus, User } from '@/shared/models';

export type PatientAndTreatmentPlan = PatientShort & {
  updatedAt: Date;
  assignee: User;
  status: TreatmentPlanStatus;
};

const patientData: PatientAndTreatmentPlan[] = [
  {
    id: 1,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Bender Bending Rodríguez',
    updatedAt: new Date(),
    assignee: {
      id: '10',
      role: 'student',
      name: 'Jéssica Andrade',
      email: 'jessica.andrade@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'draft',
  },
  {
    id: 2,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    name: 'Homer Simpson',
    updatedAt: new Date(Date.now() - 86400000),
    assignee: {
      id: '11',
      role: 'student',
      name: 'Carlos Silva',
      email: 'carlos.silva@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'in_progress',
  },
  {
    id: 3,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/marge-simpson.png',
    name: 'Marge Simpson',
    updatedAt: new Date(Date.now() - 2 * 86400000),
    assignee: {
      id: '12',
      role: 'student',
      name: 'Ana Souza',
      email: 'ana.souza@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'in_progress',
  },
  {
    id: 4,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/bart-simpson.png',
    name: 'Bart Simpson',
    updatedAt: new Date(Date.now() - 3 * 86400000),
    assignee: {
      id: '13',
      role: 'student',
      name: 'Pedro Lima',
      email: 'pedro.lima@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'draft',
  },
  {
    id: 5,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    name: 'Carol Miller',
    updatedAt: new Date(Date.now() - 4 * 86400000),
    assignee: {
      id: '14',
      role: 'student',
      name: 'Mariana Costa',
      email: 'mariana.costa@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'in_progress',
  },
  {
    id: 6,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/maggie-simpson.png',
    name: 'Maggie Simpson',
    updatedAt: new Date(Date.now() - 5 * 86400000),
    assignee: {
      id: '15',
      role: 'student',
      name: 'João Oliveira',
      email: 'joao.oliveira@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'done',
  },
  {
    id: 7,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-leela.png',
    name: 'Turanga Leela',
    updatedAt: new Date(Date.now() - 6 * 86400000),
    assignee: {
      id: '16',
      role: 'student',
      name: 'Fernanda Dias',
      email: 'fernanda.dias@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'in_progress',
  },
];

export async function getAllPatients(): Promise<PatientAndTreatmentPlan[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return patientData;
}

export async function getPatientById(
  patientId: string,
): Promise<PatientAndTreatmentPlan> {
  console.log('fething detail for procedureID: ', patientId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = patientData[Number(patientId) - 1];
  console.log(res);
  return res;
}
