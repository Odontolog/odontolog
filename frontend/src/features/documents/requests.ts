import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { Attachments } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { AttachmentDto, mapToAttachment } from '@/shared/attachments/mapper';

export function getPatientDocumentsOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientRelatedDocs', patientId],
    queryFn: () => getPatientDocuments(patientId),
  });
}

async function getPatientDocuments(patientId: string): Promise<Attachments[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/attachments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar documentos do paciente: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }

  const data = (await res.json()) as AttachmentDto[];
  return data.map((att) => mapToAttachment(att));
}
