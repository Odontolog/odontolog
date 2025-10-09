import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { Procedure } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToProcedure, ProcedureDto } from './mapper';
import { ProcedureDetail } from './models';

export function getProcedureOptions(procedureId: string) {
  return queryOptions({
    queryKey: ['procedure', procedureId],
    queryFn: () => getProcedure(procedureId),
  });
}

export async function getProcedure(procedureId: string): Promise<Procedure> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/${procedureId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar procedimento: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }

  const data = (await res.json()) as ProcedureDto;
  return mapToProcedure(data);
}

export async function saveTeeth(procedureId: string, teeth: string[]) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/${procedureId}/teeth`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teeth }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar dentes/regiões.`);
  }

  return { success: true };
}

let Superdata: ProcedureDetail = {
  notes: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
};

export async function getDetails(
  procedureId: string,
): Promise<ProcedureDetail> {
  console.log('fething detail for procedureID: ', procedureId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(Superdata);
  return Superdata;
}

export async function saveDetails(procedureId: string, data: ProcedureDetail) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('saving data', data, procedureId);
  // throw new Error('error saving data');
  Superdata = data;
  return Superdata;
}
