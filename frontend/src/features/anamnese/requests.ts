import { queryOptions } from '@tanstack/react-query';

import { getAuthToken } from '@/shared/utils';
import { Anamnese, AnamneseFormValues } from './models';

export function getAnamneseOptions(patientId: string) {
  return queryOptions({
    queryKey: ['anamnese', patientId],
    queryFn: () => getAnamnese(patientId),
  });
}

export async function getAnamnese(patientId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/anamnese`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar anamnese.`);
  }

  const data = (await res.json()) as Anamnese;
  return data;
}

export async function saveAnamneseNotes(patientId: string, notes: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/anamnese/notes`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar formulário de anamnese.`);
  }
}

export async function saveAnamnese(
  patientId: string,
  anamnese: AnamneseFormValues,
) {
  const token = await getAuthToken();

  const payload = {
    conditions: anamnese.conditions.map((c) => ({
      condition: c.condition,
      hasCondition: c.hasCondition,
      notes: c.notes,
    })),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/anamnese/conditions`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar formulário de anamnese.`);
  }
}
