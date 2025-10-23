import { notFound } from 'next/navigation';
import { queryOptions } from '@tanstack/react-query';

import { Procedure, ProcedureShort } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToProcedureShort, ProcedureShortDto } from './mappers';

export function getPatientProcedureOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientProcedureList', patientId],
    queryFn: () => getPatientProcedures(patientId),
  });
}

async function getPatientProcedures(
  patientId: string,
): Promise<ProcedureShort[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/procedures`,
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
  const data = (await res.json()) as ProcedureShortDto[];
  return data.map((p) => mapToProcedureShort(p));
}

export function getPatientPreprocedureOptions(patientId: string) {
  return queryOptions({
    queryKey: ['patientPreprocedureList', patientId],
    queryFn: () => getPatientPreprocedures(patientId),
  });
}

async function getPatientPreprocedures(
  patientId: string,
): Promise<ProcedureShort[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/pre-procedures`,
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

  const data = (await res.json()) as ProcedureShortDto[];
  return data.map((p) => mapToProcedureShort(p));
}

export async function createPreprocedure(
  patientId: string,
  selectedPreprocedure: string,
): Promise<string> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/pre-procedures`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: selectedPreprocedure }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `[${res.status}] Erro criar procedimento para o plano de tratamento.`,
    );
  }

  const data = (await res.json()) as Procedure;

  return data.id;
}

export function getNextConsultationDate(patientId: string) {
  return queryOptions({
    queryKey: ['nextConsultationDate', patientId],
    queryFn: () => getNextConsultation(patientId),
  });
}

export async function getNextConsultation(patientId: string) {
  console.log(
    `Fetching data for patient's id ${patientId} next consultation date.`,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}

export async function saveNextConsultation(
  date: Date | undefined,
  patientId: string,
) {
  console.log(JSON.stringify({ date }));
  console.log(
    `Next consultation on date ${date ? date.toISOString() : 'undefined'} saved for patient ${patientId}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}
