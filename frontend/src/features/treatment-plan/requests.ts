import { queryOptions } from '@tanstack/react-query';

import {
  addProcedure,
  supervisorMock,
  treatmentPlanMock,
} from '@/mocks/treatment-plan';
import { TreatmentPlan } from '@/shared/models';
import { createReviewableOptions } from '@/shared/reviewable/requests';
import { ProcedureFormValues } from './models';

export function getTratmentPlanOptions(treatmentPlanId: string) {
  return queryOptions({
    queryKey: ['treatmentPlan', treatmentPlanId],
    queryFn: () => getTreatmentPlan(treatmentPlanId),
  });
}

export function getTreatmentPlanReviewableOptions(treatmentPlanId: string) {
  return createReviewableOptions(['treatmentPlan', treatmentPlanId], () =>
    getTreatmentPlan(treatmentPlanId),
  );
}

async function getTreatmentPlan(
  treatmentPlanId: string,
): Promise<TreatmentPlan> {
  console.log(`Fetching data for treatment plan ${treatmentPlanId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return treatmentPlanMock;
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

  if (!procedure.plannedSession) {
    throw new Error('error saving data');
  }

  // atualiza in-place os campos editáveis
  procedures[index] = {
    ...procedures[index],
    name: procedure.name,
    studySector: procedure.studySector,
    plannedSession: procedure.plannedSession,
    tooth: procedure.tooth,
  };

  return { success: true };
}

export async function createTreatmentPlanProcedure(
  treatmentPlanId: string,
  procedure: ProcedureFormValues,
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('creating new procedure  ', procedure.name);

  if (!procedure.plannedSession) {
    throw new Error('error saving data');
  }

  addProcedure({
    id: (treatmentPlanMock.procedures.length + 101).toString(),
    name: procedure.name,
    studySector: procedure.studySector,
    plannedSession: procedure.plannedSession,
    tooth: procedure.tooth,
    treatmentPlanId,
    status: 'in_creation',
    reviewable: {
      id: 'rev-1',
      assignee: supervisorMock,
      updatedAt: new Date('2025-09-01T10:00:00Z'),
      notes: 'Necessário avaliar radiografia complementar.',
      status: 'in_review',
    },
  });

  return { success: true };
}

export async function getProcedureNames(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    'Restauração com resina composta',
    'Tratamento endodôntico',
    'Extração dentária',
    'Limpeza e profilaxia',
    'Aplicação de flúor',
    'Canal',
    'Restauração',
  ];
}

export async function getStudySectors(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    'Dentística',
    'Endodontia',
    'Cirurgia oral',
    'Periodontia',
    'Ortodontia',
  ];
}
