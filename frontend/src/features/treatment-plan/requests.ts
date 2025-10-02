import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { loggedUser } from '@/mocks/students';
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Submitting treatment plan ${treatmentPlanId} for review`);

  treatmentPlanMock.status = 'IN_REVIEW';
  treatmentPlanMock.history.push({
    id: (treatmentPlanMock.history.length + 1).toString(),
    type: 'REVIEW_REQUESTED',
    actor: loggedUser,
    description: 'Solicitação de validação enviada para o(s) supervisor(es).',
    createdAt: new Date(),
    metadata: {
      data: note,
    },
  });

  return { success: true };
}

export async function submitReviewForTreatmentPlan(
  treatmentPlanId: string,
  values: { note: string; decision: string | null },
) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Submitting review for plan ${treatmentPlanId}`);

  treatmentPlanMock.status = 'DONE';
  treatmentPlanMock.history.push({
    id: (treatmentPlanMock.history.length + 1).toString(),
    type: values.decision === 'Aprovar' ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED', // <- Depende do que foi selecionado no radio button
    actor: loggedUser,
    description: `Validação concedida pelo(a) supervisor(a) ${loggedUser.name}`,
    createdAt: new Date(),
    metadata: {
      data: values.note,
    },
  });

  return { success: true };
}
