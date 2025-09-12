import { Review, Student, Supervisor, TreatmentPlan } from '@/shared/models';

const supervisor: Supervisor = {
  id: '6',
  name: 'Dr. Ana Souza',
  email: 'ana.souza@clinica.edu',
  role: 'supervisor',
  avatarUrl: '',
  specialty: 'Ortodontia',
  siape: '123456',
};

const student: Student = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos.silva@aluno.edu',
  role: 'student',
  avatarUrl: '',
  clinic: 2,
  enrollment: 202301,
  semester: 4,
};

export const treatmentPlanMock: TreatmentPlan = {
  id: 'tp-1',
  status: 'active',
  procedures: [
    {
      id: 'proc-1',
      studySector: 'Setor A',
      tooth: ['11', '12'],
      treatmentPlanId: 'tp-1',
      reviewable: {
        id: 'rev-1',
        assignee: supervisor,
        updatedAt: new Date('2025-09-01T10:00:00Z'),
        notes: 'Necessário avaliar radiografia complementar.',
        status: 'in_review',
      },
    },
    {
      id: 'proc-2',
      studySector: 'Setor B',
      tooth: ['21'],
      treatmentPlanId: 'tp-1',
      reviewable: {
        id: 'rev-2',
        assignee: student,
        updatedAt: new Date('2025-09-05T14:30:00Z'),
        notes: 'Aluno iniciou execução prática.',
        status: 'in_progress',
      },
    },
  ],
  reviewableId: 'rev-tp-1',
  reviewable: {
    id: 'rev-tp-1',
    author: student,
    assignee: supervisor,
    createdAt: new Date('2025-08-28T09:00:00Z'),
    updatedAt: new Date('2025-09-05T14:30:00Z'),
    reviews: [
      {
        id: '1',
        note: 'Plano inicial bem estruturado.',
        grade: 9,
        status: 'approved',
        supervisor,
      },
    ],
    notes: 'Plano de tratamento focado em ortodontia.',
    history: [
      {
        id: 'act-1',
        type: 'created',
        actor: student,
        createdAt: new Date('2025-08-28T09:00:00Z'),
      },
      {
        id: 'act-2',
        type: 'review_approved',
        actor: supervisor,
        createdAt: new Date('2025-08-29T16:00:00Z'),
        metadata: { feedback: 'Aprovado com ajustes mínimos.' },
      },
    ],
    type: 'treatment_plan',
    status: 'in_review',
  },
};

export function updateReviews(reviews: Review[]) {
  treatmentPlanMock.reviewable.reviews = reviews;
}

export function setNote(notes: string) {
  treatmentPlanMock.reviewable.notes = notes;
}
