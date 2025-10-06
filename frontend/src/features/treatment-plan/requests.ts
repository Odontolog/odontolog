import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import {
  addProcedure,
  patient,
  supervisor,
  treatmentPlanMock,
} from '@/mocks/treatment-plan';
import { TreatmentPlan } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { ProcedureFormValues } from './models';

export function getTratmentPlanOptions(treatmentPlanId: string) {
  return queryOptions({
    queryKey: ['treatmentPlan', treatmentPlanId],
    queryFn: () => getTreatmentPlan(treatmentPlanId),
  });
}

export async function getTreatmentPlan(
  treatmentPlanId: string,
): Promise<TreatmentPlan> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/treatment-plan/${treatmentPlanId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar plano: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }

  return (await res.json()) as TreatmentPlan;
}

export async function editTreatmentPlanProcedure(
  treatmentPlanId: string,
  procedure: ProcedureFormValues,
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('saving changes to database for ', procedure.name);

  const procedures = treatmentPlanMock.procedures;
  const index = procedures.findIndex((p) => p.id === procedure.id);

  if (index === -1) {
    throw new Error(
      `Procedure ${procedure.id} not found in treatment plan ${treatmentPlanId}`,
    );
  }

  if (procedure.plannedSession === undefined) {
    throw new Error('error saving data');
  }

  // atualiza in-place os campos editáveis
  procedures[index] = {
    ...procedures[index],
    name: procedure.name,
    studySector: procedure.studySector,
    plannedSession: procedure.plannedSession,
    teeth: procedure.tooth,
  };

  return { success: true };
}

export async function createTreatmentPlanProcedure(
  treatmentPlanId: string,
  procedure: ProcedureFormValues,
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('creating new procedure  ', procedure.name, treatmentPlanId);

  if (procedure.plannedSession === undefined) {
    throw new Error('error saving data');
  }

  addProcedure({
    id: (treatmentPlanMock.procedures.length + 101).toString(),
    name: procedure.name,
    studySector: procedure.studySector,
    plannedSession: procedure.plannedSession,
    teeth: procedure.tooth,
    status: 'DRAFT',
    reviews: [],
    procedureType: 'TREATMENT_PLAN_PROCEDURE',
    type: 'PROCEDURE',
    patient,
    assignee: supervisor,
    updatedAt: new Date('2025-09-01T10:00:00Z'),
    notes: 'Necessário avaliar radiografia complementar.',
  });

  return { success: true };
}

export async function submitTreatmentPlanForReview(
  treatmentPlanId: string,
  note: string,
) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/treatment-plan/${treatmentPlanId}/submit-for-review`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comments: note }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `[${res.status}] Erro ao submeter plano de tratamento para validação.`,
    );
  }
}

export async function submitReviewForTreatmentPlan(treatmentPlanId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Submitting review for plan ${treatmentPlanId}`);

  return { success: true };
}
