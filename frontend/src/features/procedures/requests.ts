import { notFound } from 'next/navigation';
import { queryOptions } from '@tanstack/react-query';

import { ProcedureShort } from '@/shared/models';
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
