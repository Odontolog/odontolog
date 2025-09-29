import { getSession } from 'next-auth/react';
import { queryOptions } from '@tanstack/react-query';

import {
  addProcedure,
  patient,
  supervisor,
  treatmentPlanMock,
} from '@/mocks/treatment-plan';
import { TreatmentPlan } from '@/shared/models';
import { ProcedureFormValues } from './models';
import { loggedUser } from '@/mocks/students';

export function getTratmentPlanOptions(treatmentPlanId: string) {
  return queryOptions({
    queryKey: ['treatmentPlan', treatmentPlanId],
    queryFn: () => getTreatmentPlan(treatmentPlanId),
  });
}

export async function getTreatmentPlan(
  treatmentPlanId: string,
): Promise<TreatmentPlan> {
  console.log(`Fetching data for treatment plan ${treatmentPlanId}`);

  const session = await getSession();
  if (session?.user?.accessToken == null || session.user.accessToken === '') {
    throw new Error('Usuário não autenticado');
  }

  const res = await fetch(
    `http://localhost:8080/api/v1/treatment-plan/${treatmentPlanId}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar plano: ${res.status}`);
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
    status: 'draft',
    reviews: [],
    procedureType: 'treatment_plan_procedure',
    type: 'procedure',
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

  treatmentPlanMock.status = 'in_review';
  treatmentPlanMock.history.push({
    id: (treatmentPlanMock.history.length + 1).toString(),
    type: 'review_requested',
    actor: loggedUser,
    description: 'Solicitação de validação enviada para o(s) supervisor(es).',
    createdAt: new Date(),
    metadata: {
      data: note,
    },
  });

  return { success: true };
}
