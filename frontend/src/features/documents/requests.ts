import { attachments } from '@/mocks/treatment-plan';
import { Attachments } from '@/shared/models';
import { queryOptions } from '@tanstack/react-query';

export function getPatientDocumentsOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientRelatedDocs', patientId],
    queryFn: () => getPatientDocuments(),
  });
}

async function getPatientDocuments(): Promise<Attachments[]> {
  await Promise.resolve();
  return attachments;
}
