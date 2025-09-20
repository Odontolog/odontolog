import {
  TreatmentPlan,
  User,
  PatientShort,
  Review,
  Activity,
  ProcedureShort,
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
  id: 1,
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
const procedures: ProcedureShort[] = [
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
