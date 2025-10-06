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
