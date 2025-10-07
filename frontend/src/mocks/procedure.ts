import { Procedure } from '@/shared/models';
import { patient, student, supervisor } from './treatment-plan';

export const mockProcedure: Procedure = {
  id: '1',
  author: student,
  assignee: student,
  patient,
  createdAt: new Date('2025-09-10T10:00:00Z'),
  updatedAt: new Date('2025-10-01T12:30:00Z'),
  notes:
    'Paciente relatou sensibilidade no dente 14 após o procedimento anterior.',
  reviews: [
    {
      id: '401',
      note: 'Bom progresso, mas revisar técnica de isolamento.',
      grade: 8.5,
      reviewStatus: 'APPROVED',
      supervisor,
    },
  ],
  reviewers: [supervisor],
  history: [
    {
      id: 1,
      type: 'CREATED',
      actor: {
        id: '101',
        role: 'STUDENT',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        avatarUrl: 'https://example.com/avatars/student-101.png',
      },
      description: 'Procedimento criado pelo estudante João Silva.',
      createdAt: new Date('2025-09-10T10:00:00Z'),
    },
    {
      id: 2,
      type: 'REVIEW_APPROVED',
      actor: {
        id: '201',
        role: 'SUPERVISOR',
        name: 'Dra. Maria Oliveira',
        email: 'maria.oliveira@example.com',
        avatarUrl: 'https://example.com/avatars/supervisor-201.png',
      },
      description: 'Revisão aprovada pela Dra. Maria Oliveira.',
      createdAt: new Date('2025-09-20T14:15:00Z'),
    },
  ],
  type: 'PROCEDURE',
  status: 'IN_PROGRESS',
  name: 'Restauração de amálgama dente 14',
  attachments: [
    {
      id: '501',
      location: 'https://example.com/uploads/procedure-1/photo-before.jpg',
      filename: 'photo-before.jpg',
      uploader: {
        id: '101',
        role: 'STUDENT',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        avatarUrl: 'https://example.com/avatars/student-101.png',
      },
      size: 2450000, // bytes
    },
    {
      id: '502',
      location: 'https://example.com/uploads/procedure-1/photo-after.jpg',
      filename: 'photo-after.jpg',
      uploader: {
        id: '101',
        role: 'STUDENT',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        avatarUrl: 'https://example.com/avatars/student-101.png',
      },
      size: 2800000,
    },
  ],
  studySector: 'Dentística',
  teeth: ['14', '15'],
  details: {
    diagnostic: 'Cárie incipiente em dente 14.',
  },
  procedureType: 'PRE_PROCEDURE',
  treatmentPlanId: '7001',
};
