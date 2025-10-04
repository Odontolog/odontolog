import {
  TreatmentPlan,
  User,
  PatientShort,
  Review,
  Activity,
  ProcedureShort,
  TreatmentPlanShort,
} from '@/shared/models';

// Usuários
export const supervisor: User = {
  id: '7',
  role: 'SUPERVISOR',
  name: 'Dr. João Silva',
  email: 'joao.silva@clinic.com',
  avatarUrl: '',
};

export const supervisor2: User = {
  id: '8',
  role: 'SUPERVISOR',
  name: 'Dr. João Martino',
  email: 'joao.martino@clinic.com',
  avatarUrl: '',
};

export const student: User = {
  id: '6',
  role: 'STUDENT',
  name: 'Maria Souza',
  email: 'maria.souza@aluno.ufal.br',
  avatarUrl: '',
};

// Paciente
export const patient: PatientShort = {
  id: '1',
  avatarUrl: '',
  name: 'Carlos Pereira',
};

// Reviews
const reviews: Review[] = [
  {
    id: '1',
    note: 'Plano inicial bem detalhado.',
    grade: 9,
    reviewStatus: 'APPROVED',
    supervisor,
  },
  {
    id: '2',
    note: 'Falta detalhar dente 14.',
    grade: 7,
    reviewStatus: 'PENDING',
    supervisor: supervisor2,
  },
];

// Histórico
const history: Activity[] = [
  {
    id: '1',
    type: 'CREATED',
    actor: student,
    description: 'Plano de tratamento criado pelo aluno.',
    createdAt: new Date('2025-09-01T10:00:00Z'),
  },
  {
    id: '2',
    type: 'REVIEW_REQUESTED',
    actor: student,
    description: 'Solicitação de validação enviada para o(s) supervisor(es).',
    createdAt: new Date('2025-09-03T09:30:00Z'),
    metadata: {
      data: 'Coloquei apenas os procedimentos necessários. Acho que não seria adequado fazer o procedimento de canal.',
    },
  },
  {
    id: '3',
    type: 'REVIEW_APPROVED',
    actor: supervisor,
    description: 'Plano de tratamento aprovado pelo supervisor.',
    createdAt: new Date('2025-09-05T14:00:00Z'),
    metadata: {
      data: 'Sem problemas. Também acho que o canal não seria necessário. Caso o paciente venha a sentir dor, alternamos.',
    },
  },
];

// Procedimentos curtos
export const procedures: ProcedureShort[] = [
  {
    id: '1',
    status: 'DONE',
    name: 'Obturação',
    studySector: 'Endodontia',
    plannedSession: 1,
    assignee: student,
    patient,
    teeth: ['12'],
    updatedAt: new Date('2025-09-05T13:00:00Z'),
    reviews,
    notes: 'Revisar técnica de isolamento.',
    procedureType: 'TREATMENT_PLAN_PROCEDURE',
    type: 'PROCEDURE',
  },
  {
    id: '2',
    status: 'DONE',
    name: 'Extração',
    studySector: 'Cirurgia',
    plannedSession: 2,
    assignee: student,
    patient,
    teeth: ['14'],
    updatedAt: new Date('2025-09-07T16:30:00Z'),
    reviews: [],
    notes: 'Aguardando autorização do paciente.',
    procedureType: 'TREATMENT_PLAN_PROCEDURE',
    type: 'PROCEDURE',
  },
  {
    id: '3',
    status: 'DONE',
    name: 'Limpeza',
    studySector: 'Periodontia',
    plannedSession: 3,
    assignee: student,
    patient,
    teeth: ['11', '12', '13'],
    updatedAt: new Date('2025-09-08T11:00:00Z'),
    reviews: [],
    notes: 'Limpeza realizada sem intercorrências.',
    procedureType: 'TREATMENT_PLAN_PROCEDURE',
    type: 'PROCEDURE',
  },
  {
    id: '4',
    status: 'DONE',
    name: 'Limpeza',
    studySector: 'Periodontia',
    plannedSession: 3,
    assignee: student,
    patient,
    teeth: ['11', '12', '13'],
    updatedAt: new Date('2025-09-06T11:00:00Z'),
    reviews: [],
    notes: 'Limpeza realizada sem intercorrências.',
    procedureType: 'TREATMENT_PLAN_PROCEDURE',
    type: 'PROCEDURE',
  },
];

// Mock TreatmentPlan
export const treatmentPlanMock: TreatmentPlan = {
  id: '1',
  author: student,
  assignee: student,
  patient,
  createdAt: new Date('2025-09-01T10:00:00Z'),
  updatedAt: new Date('2025-09-07T17:00:00Z'),
  notes: 'Plano de tratamento inicial do paciente Carlos Pereira.',
  reviews,
  history,
  type: 'TREATMENT_PLAN',
  status: 'DRAFT',
  procedures,
};

export const mockTreatmentPlans: TreatmentPlanShort[] = [
  {
    id: '1',
    status: 'DRAFT',
    assignee: {
      id: '101',
      role: 'STUDENT',
      name: 'Ana Souza',
      email: 'ana.souza@example.com',
      avatarUrl: '',
    },
    patient: {
      id: '201',
      avatarUrl: '',
      name: 'Carlos Pereira',
    },
    updatedAt: new Date('2024-09-10T14:30:00'),
    notes: 'Necessita avaliação inicial para confirmar diagnóstico.',
    type: 'TREATMENT_PLAN',
  },
  {
    id: '6',
    status: 'IN_PROGRESS',
    assignee: {
      id: '102',
      role: 'STUDENT',
      name: 'Bruno Lima',
      email: 'bruno.lima@example.com',
      avatarUrl: '',
    },
    patient: {
      id: '202',
      avatarUrl: '',
      name: 'Mariana Costa',
    },
    updatedAt: new Date('2024-09-15T09:00:00'),
    notes: 'Extração do dente 38 realizada. Próxima sessão: obturação.',
    type: 'TREATMENT_PLAN',
  },
  {
    id: '9',
    status: 'IN_REVIEW',
    assignee: {
      id: '103',
      role: 'SUPERVISOR',
      name: 'Dra. Fernanda Alves',
      email: 'fernanda.alves@example.com',
      avatarUrl: '',
    },
    patient: {
      id: '203',
      avatarUrl: '',
      name: 'João Ricardo',
    },
    updatedAt: new Date('2022-09-18T16:45:00'),
    notes: 'Plano em revisão. Ajustar sequência de procedimentos.',
    type: 'TREATMENT_PLAN',
  },
];

export function updateReviews(reviews: Review[]) {
  treatmentPlanMock.reviews = reviews;
}

export function setNote(notes: string) {
  treatmentPlanMock.notes = notes;
}

export function addProcedure(procedure: ProcedureShort) {
  treatmentPlanMock.procedures.push(procedure);
}

export function editProcedure(procedure: ProcedureShort) {
  for (let i = 0; i < treatmentPlanMock.procedures.length; i++) {
    if (treatmentPlanMock.procedures[i].id === procedure.id) {
      treatmentPlanMock.procedures[i] = {
        ...treatmentPlanMock.procedures[i],
        ...procedure,
      };
    }
  }
}

export function updateAssignee(assignee: User) {
  treatmentPlanMock.assignee = assignee;
}
