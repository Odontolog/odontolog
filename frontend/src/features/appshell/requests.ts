import { notFound } from 'next/navigation';

import { PatientShort, TreatmentPlanStatus } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import {
  mapToPatientandTreatmentPlan,
  PatientAndTreatmentPlanDTO,
} from './mappers';

export type PatientAndTreatmentPlan = PatientShort & {
  lastTreatmentPlanId: string;
  lastTreatmentPlanStatus: TreatmentPlanStatus;
  lastTreatmentPlanUpdatedAt: Date;
};

export async function getAllPatients(
  search?: string,
): Promise<PatientAndTreatmentPlan[]> {
  const token = await getAuthToken();

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/search`);
  if (search !== undefined) {
    url.searchParams.append('term', search);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar plano: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }

  const data = (await res.json()) as PatientAndTreatmentPlanDTO[];
  return data.map((p) => mapToPatientandTreatmentPlan(p));
}
