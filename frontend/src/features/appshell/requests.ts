import { PatientShort, TreatmentPlanStatus, User } from '@/shared/models';

export type PatientAndTreatmentPlan = PatientShort & {
  updatedAt: Date;
  assignee: User;
  status: TreatmentPlanStatus;
};

const patientData: PatientAndTreatmentPlan[] = [
  {
    id: '1',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'João Silva',
    updatedAt: new Date(),
    assignee: {
      id: '10',
      role: 'STUDENT',
      name: 'Jéssica Andrade',
      email: 'jessica.andrade@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'DRAFT',
  },
  {
    id: '2',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: 'Maria Oliveira',
    updatedAt: new Date(Date.now() - 86400000),
    assignee: {
      id: '11',
      role: 'STUDENT',
      name: 'Carlos Silva',
      email: 'carlos.silva@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'IN_PROGRESS',
  },
  {
    id: '3',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'Carlos Pereira',
    updatedAt: new Date(Date.now() - 2 * 86400000),
    assignee: {
      id: '12',
      role: 'STUDENT',
      name: 'Ana Souza',
      email: 'ana.souza@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'IN_PROGRESS',
  },
  {
    id: '4',
    avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    name: 'Ana Souza',
    updatedAt: new Date(Date.now() - 3 * 86400000),
    assignee: {
      id: '13',
      role: 'STUDENT',
      name: 'Pedro Lima',
      email: 'pedro.lima@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'DRAFT',
  },
  {
    id: '5',
    avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    name: 'Pedro Costa',
    updatedAt: new Date(Date.now() - 4 * 86400000),
    assignee: {
      id: '14',
      role: 'STUDENT',
      name: 'Mariana Costa',
      email: 'mariana.costa@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'IN_PROGRESS',
  },
  {
    id: '6',
    avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    name: 'Fernanda Lima',
    updatedAt: new Date(Date.now() - 5 * 86400000),
    assignee: {
      id: '15',
      role: 'STUDENT',
      name: 'João Oliveira',
      email: 'joao.oliveira@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'DONE',
  },
  {
    id: '7',
    avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'Rafael Martins',
    updatedAt: new Date(Date.now() - 6 * 86400000),
    assignee: {
      id: '16',
      role: 'STUDENT',
      name: 'Fernanda Dias',
      email: 'fernanda.dias@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'IN_PROGRESS',
  },
  {
    id: '8',
    avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
    name: 'Juliana Alves',
    updatedAt: new Date(Date.now() - 7 * 86400000),
    assignee: {
      id: '17',
      role: 'STUDENT',
      name: 'Lucas Almeida',
      email: 'lucas.almeida@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'DRAFT',
  },
  {
    id: '9',
    avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
    name: 'Lucas Rocha',
    updatedAt: new Date(Date.now() - 8 * 86400000),
    assignee: {
      id: '18',
      role: 'STUDENT',
      name: 'Patrícia Gomes',
      email: 'patricia.gomes@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'IN_PROGRESS',
  },
  {
    id: '10',
    avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
    name: 'Patrícia Mendes',
    updatedAt: new Date(Date.now() - 9 * 86400000),
    assignee: {
      id: '19',
      role: 'STUDENT',
      name: 'Rafael Souza',
      email: 'rafael.souza@foufal.ufal.br',
      avatarUrl: '',
    },
    status: 'DONE',
  },
];

export async function getAllPatients(): Promise<PatientAndTreatmentPlan[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return patientData;
}

export async function getPatientById(
  patientId: string,
): Promise<PatientAndTreatmentPlan | undefined> {
  console.log('fething detail for procedureID: ', patientId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = patientData.find((p) => p.id === patientId);
  return res;
}
