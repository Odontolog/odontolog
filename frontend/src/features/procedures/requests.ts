import { procedures } from '@/mocks/treatment-plan';
import { ProcedureShort } from '@/shared/models';
import { queryOptions } from '@tanstack/react-query';

export function getPatientProcedureList(patientId: string) {
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
