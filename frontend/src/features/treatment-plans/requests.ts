import { queryOptions } from '@tanstack/react-query';

import { mockTreatmentPlans } from '@/mocks/treatment-plan';
import { TreatmentPlan, TreatmentPlanShort } from '@/shared/models';
import { requireAuth } from '@/shared/utils';

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

export async function createPatientTreatmentPlan(patientId: string) {
  const user = await requireAuth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/treatment-plan`,
    {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ patientId }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao criar plano de tratamento.`);
  }

  const data = (await res.json()) as TreatmentPlan;

  return data.id;
}
