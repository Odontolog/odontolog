import { Patient } from '@/shared/models';

const patientData: Patient[] = [
  {
    id: 1,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Bender Bending Rodríguez',
    lastModified: new Date(),
    assignee: {
      role: 'student',
      name: 'Jéssica Andrade',
      email: 'jessica.andrade@foufal.ufal.br',
      clinic: 3,
      enrollment: 21210843,
      semester: 2024.2,
    },
    status: 'not_started',
  },
  {
    id: 2,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    name: 'Homer Simpson',
    lastModified: new Date(Date.now() - 86400000),
    assignee: {
      role: 'student',
      name: 'Carlos Silva',
      email: 'carlos.silva@foufal.ufal.br',
      clinic: 1,
      enrollment: 21210844,
      semester: 2024.2,
    },
    status: 'in_progress',
  },
  {
    id: 3,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/marge-simpson.png',
    name: 'Marge Simpson',
    lastModified: new Date(Date.now() - 2 * 86400000),
    assignee: {
      role: 'student',
      name: 'Ana Souza',
      email: 'ana.souza@foufal.ufal.br',
      clinic: 2,
      enrollment: 21210845,
      semester: 2024.2,
    },
    status: 'in_progress',
  },
  {
    id: 4,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/bart-simpson.png',
    name: 'Bart Simpson',
    lastModified: new Date(Date.now() - 3 * 86400000),
    assignee: {
      role: 'student',
      name: 'Pedro Lima',
      email: 'pedro.lima@foufal.ufal.br',
      clinic: 3,
      enrollment: 21210846,
      semester: 2024.2,
    },
    status: 'not_started',
  },
  {
    id: 5,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    name: 'Carol Miller',
    lastModified: new Date(Date.now() - 4 * 86400000),
    assignee: {
      role: 'student',
      name: 'Mariana Costa',
      email: 'mariana.costa@foufal.ufal.br',
      clinic: 4,
      enrollment: 21210847,
      semester: 2024.2,
    },
    status: 'in_progress',
  },
  {
    id: 6,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/maggie-simpson.png',
    name: 'Maggie Simpson',
    lastModified: new Date(Date.now() - 5 * 86400000),
    assignee: {
      role: 'student',
      name: 'João Oliveira',
      email: 'joao.oliveira@foufal.ufal.br',
      clinic: 5,
      enrollment: 21210848,
      semester: 2024.2,
    },
    status: 'finished',
  },
  {
    id: 7,
    avatarUrl: 'https://img.icons8.com/clouds/256/000000/futurama-leela.png',
    name: 'Turanga Leela',
    lastModified: new Date(Date.now() - 6 * 86400000),
    assignee: {
      role: 'student',
      name: 'Fernanda Dias',
      email: 'fernanda.dias@foufal.ufal.br',
      clinic: 6,
      enrollment: 21210849,
      semester: 2024.2,
    },
    status: 'in_progress',
  },
];

export async function getAllPatients(): Promise<Patient[]> {
  return patientData;
}

export async function getPatientById(patientId: string): Promise<Patient> {
  console.log('fething detail for procedureID: ', patientId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = patientData[Number(patientId) - 1];
  console.log(res);
  return res;
}
