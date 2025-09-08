import { Supervisor, SupervisorAndReview } from '@/features/procedure/models';

export let supervisorsAndReviews: SupervisorAndReview[] = [
  {
    id: '1',
    name: 'Dr. Théo',
    email: 'theo@foufal.ufal.br',
    specialty: 'Emergência',
    siape: '12345',
    avatarUrl: '',
    lastReview: {
      note: 'something',
      grade: 7.0,
      status: 'approved',
    },
  },
  {
    id: '2',
    name: 'Dr. Alexandre',
    email: 'alexandre@foufal.ufal.br',
    specialty: 'Periodontia',
    siape: '12345',
    avatarUrl: '',
    lastReview: {
      note: 'something',
      grade: 8.5,
      status: 'approved',
    },
  },
];

export function setSupervisorsAndReviews(sar: SupervisorAndReview[]) {
  supervisorsAndReviews = sar;
}

export const supervisors: Supervisor[] = [
  {
    id: '1',
    name: 'Dr. Théo',
    email: 'theo@foufal.ufal.br',
    specialty: 'Emergência',
    siape: '12345',
    avatarUrl: '',
  },
  {
    id: '2',
    name: 'Dr. Alexandre',
    email: 'alexandre@foufal.ufal.br',
    specialty: 'Periodontia',
    siape: '12345',
    avatarUrl: '',
  },
  {
    id: '3',
    name: 'Dr. Marcos',
    email: 'marcos@foufal.ufal.br',
    specialty: 'Dentística',
    siape: '12345',
    avatarUrl: '',
  },
  {
    id: '4',
    email: 'joao@ufal.br',
    name: 'Dr. João Silva',
    specialty: 'Endodontia',
    siape: '12345',
    avatarUrl: '',
  },
  {
    id: '5',
    email: 'maria@ufal.br',
    name: 'Dra. Maria Souza',
    specialty: 'Prótese',
    siape: '67890',
    avatarUrl: '',
  },
];
