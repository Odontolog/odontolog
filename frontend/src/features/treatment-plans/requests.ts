import { queryOptions } from '@tanstack/react-query';

import { TreatmentPlan, TreatmentPlanShort } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToTreatmentPlanShort, TreatmentPlanShortDto } from './mappers';

export function getPatientTratmentPlansOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientTreatmentPlans', patientId],
    queryFn: () => getPatientTratmentPlans(patientId),
  });
}

async function getPatientTratmentPlans(
  patientId: string,
): Promise<TreatmentPlanShort[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/treatment-plan`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar planos de tratamento.`);
  }

  const data = (await res.json()) as TreatmentPlanShortDto[];
  return data.map((dto) => mapToTreatmentPlanShort(dto));
}

export async function createPatientTreatmentPlan(patientId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/treatment-plan`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
