import { queryOptions } from '@tanstack/react-query';

const attachmentsMock = [
  {
    id: '1026da4d-e33d-4842-a703-5637bdd83674',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: 'relatório-set-beatriz.pdf',
    location: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png',
    type: 'application/pdf',
    size: '23Mb',
    uploader: 'José Fernando de Lira',
  },
  {
    id: '20b8ec60-6985-4bff-a889-251c78bd487c',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: 'relatório-mes-beatriz.pptx.png',
    location: './relatório-mes-beatriz.pptx.png',
    type: 'image/png',
    size: '15kb',
    uploader: 'Robertinho do Gelo',
  },
  {
    id: 'ab48620d-e60a-40a5-bb86-5661f52df532',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: '2025-09-18 23-41-50.mp4',
    location: './2025-09-18 23-41-50.mp4',
    type: 'video/mp4',
    size: '730Tb',
    uploader: 'Henrique Henrique Henrique Santos',
  },
  {
    id: '1026da4d-e33d-4842-a703-5637bdd83672',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: 'relatório-set-beatriz.pdf',
    location: './relatório-set-beatriz.pdf',
    type: 'application/pdf',
    size: '23Mb',
    uploader: 'José Fernando de Lira',
  },
  {
    id: '20b8ec60-6985-4bff-a889-251c78bd48jc',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: 'relatório-mes-beatriz.pptx.png',
    location: './relatório-mes-beatriz.pptx.png',
    type: 'image/png',
    size: '15kb',
    uploader: 'Robertinho do Gelo',
  },
  {
    id: 'ab48620d-e60a-40a5-bb86-5661f52df53s',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: '2025-09-18 23-41-50.mp4',
    location: './2025-09-18 23-41-50.mp4',
    type: 'video/mp4',
    size: '730Tb',
    uploader: 'Henrique Henrique Henrique Santos',
  },
  {
    id: 'ab48620d-e60a-40a5-bb86-5661f52df5m2',
    createdAt: new Date('2025-10-15T17:23:26.521Z'),
    filename: '2025-09-18 23-41-50.mp4',
    location: './2025-09-18 23-41-50.mp4',
    type: 'video/mp4',
    size: '730Tb',
    uploader: 'Henrique Henrique Henrique Santos',
  },
];

export function getPatientDocumentsOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientRelatedDocs', patientId],
    queryFn: () => getPatientDocuments(),
  });
}

async function getPatientDocuments() {
  await Promise.resolve();
  return attachmentsMock;
}
