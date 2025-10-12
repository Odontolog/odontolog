import { queryOptions } from '@tanstack/react-query';

import { ProcedureShort } from '@/shared/models';
import { procedures } from '@/mocks/treatment-plan';

export function getPatientProcedureOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientProcedureList', patientId],
    queryFn: () => getPatientProcedures(patientId),
  });
}

async function getPatientProcedures(
  patientId: string,
): Promise<ProcedureShort[]> {
  console.log(`fetching data for patient ${patientId} procedures`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return procedures.filter((procedure) => procedure.status === 'DONE');
}

export function getNextConsultationDate(patientId: string) {
  return queryOptions({
    queryKey: ['nextConsultationDate', patientId],
    queryFn: () => getNextConsultation(patientId),
  });
}

export async function getNextConsultation(patientId: string) {
  console.log(
    `Fetching data for patient's id ${patientId} next consultation date.`,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}

export async function saveNextConsultation(
  date: Date | undefined,
  patientId: string,
) {
  console.log(JSON.stringify({ date }));
  console.log(
    `Next consultation on date ${date ? date.toISOString() : 'undefined'} saved for patient ${patientId}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}
