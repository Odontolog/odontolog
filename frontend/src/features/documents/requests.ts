import { attachments } from '@/mocks/treatment-plan';
import { Attachments } from '@/shared/models';
import { queryOptions } from '@tanstack/react-query';
import { newAttachment } from './models';

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

export async function saveAttachmentOnPatient(
  patientId: string,
  atts: newAttachment[],
) {
  console.log('saving the new attachment on the patient: ', patientId);

  await new Promise((resolve) => setTimeout(resolve, 600));

  if (atts === null) {
    console.log('Banana');
    return;
  }

  return { success: true };
}
