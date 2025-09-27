import { queryOptions } from '@tanstack/react-query';

import { mockTreatmentPlans } from '@/mocks/treatment-plan';
import { TreatmentPlanShort } from '@/shared/models';

export function getPatientTratmentPlansOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientTreatmentPlans', patientId],
    queryFn: () => getPatientTratmentPlans(patientId),
  });
}

async function getPatientTratmentPlans(
  patientId: string,
): Promise<TreatmentPlanShort[]> {
  console.log(`Fetching data for patient treatment plans ${patientId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockTreatmentPlans;
}
