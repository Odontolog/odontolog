import { queryOptions } from '@tanstack/react-query';

import { proceduresShort } from '@/mocks/treatment-plan';
import { ProcedureShort } from '@/shared/models';

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
  return proceduresShort.filter((procedure) => procedure.status === 'DONE');
}
