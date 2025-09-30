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
  role: 'supervisor',
  name: 'Dr. João Silva',
  email: 'joao.silva@clinic.com',
  avatarUrl: '',
};

export const supervisor2: User = {
  id: '8',
  role: 'supervisor',
  name: 'Dr. João Martino',
  email: 'joao.martino@clinic.com',
  avatarUrl: '',
};

export const student: User = {
  id: '6',
  role: 'student',
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
    status: 'approved',
    supervisor,
  },
  {
    id: '2',
    note: 'Falta detalhar dente 14.',
    grade: 7,
    status: 'pending',
    supervisor: supervisor2,
  },
];

// Histórico
const history: Activity[] = [
  {
    id: '1',
    type: 'created',
    actor: student,
    description: 'Plano de tratamento criado pelo aluno.',
    createdAt: new Date('2025-09-01T10:00:00Z'),
  },
  {
    id: '2',
    type: 'review_requested',
    actor: student,
    description: 'Solicitação de validação enviada para o(s) supervisor(es).',
    createdAt: new Date('2025-09-03T09:30:00Z'),
    metadata: {
      data: 'Coloquei apenas os procedimentos necessários. Acho que não seria adequado fazer o procedimento de canal.',
    },
  },
  {
    id: '3',
    type: 'review_approved',
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
    status: 'in_review',
    name: 'Obturação',
    studySector: 'Endodontia',
    plannedSession: 1,
    assignee: student,
    patient,
    teeth: ['12'],
    updatedAt: new Date('2025-09-05T13:00:00Z'),
    reviews,
    notes: 'Revisar técnica de isolamento.',
    procedureType: 'treatment_plan_procedure',
    type: 'procedure',
  },
  {
    id: '2',
    status: 'not_started',
    name: 'Extração',
    studySector: 'Cirurgia',
    plannedSession: 2,
    assignee: student,
    patient,
    teeth: ['14'],
    updatedAt: new Date('2025-09-07T16:30:00Z'),
    reviews: [],
    notes: 'Aguardando autorização do paciente.',
    procedureType: 'treatment_plan_procedure',
    type: 'procedure',
  },
  {
    id: '3',
    status: 'done',
    name: 'Limpeza',
    studySector: 'Periodontia',
    plannedSession: 3,
    assignee: student,
    patient,
    teeth: ['11', '12', '13'],
    updatedAt: new Date('2025-09-08T11:00:00Z'),
    reviews: [],
    notes: 'Limpeza realizada sem intercorrências.',
    procedureType: 'treatment_plan_procedure',
    type: 'procedure',
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
  type: 'treatment_plan',
  status: 'draft',
  procedures,
};

export const mockTreatmentPlans: TreatmentPlanShort[] = [
  {
    id: '3',
    status: 'draft',
    assignee: {
      id: '101',
      role: 'student',
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
    type: 'treatment_plan',
  },
  {
    id: 'cfac8dac-afd0-4cf7-9fd8-9662b1e8f978',
    status: 'in_progress',
    assignee: {
      id: '102',
      role: 'student',
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
    type: 'treatment_plan',
  },
  {
    id: '9',
    status: 'in_review',
    assignee: {
      id: '103',
      role: 'supervisor',
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
    type: 'treatment_plan',
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
