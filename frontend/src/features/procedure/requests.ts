import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { attachments, procedures } from '@/mocks/treatment-plan';
import { Attachments, Procedure } from '@/shared/models';
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

export async function saveStudySector(
  procedureId: string,
  studySector: string,
) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/${procedureId}/study-sector`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studySector }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar seção de estudo.`);
  }

  return { success: true };
}

export function getProcedureDetailsOptions(procedureId: string) {
  return queryOptions({
    queryKey: ['procedure', procedureId, 'details'],
    queryFn: () => getDetails(procedureId),
  });
}

let Superdata: ProcedureDetail = {
  notes: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  diagnostic:
    'Paciente apresenta boa colaboração durante o procedimento. Anestesia local efetiva. Isolamento absoluto realizado com sucesso. Acesso coronário realizado sem intercorrências.',
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

export async function getAttachments(
  procedureId: string,
): Promise<Attachments[]> {
  console.log('fething attachments for procedureID: ', procedureId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return attachments;
}

export async function getAttachmentById(
  attachmentId: string,
): Promise<Attachments> {
  console.log('fething attachments: ', attachmentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const att = attachments.find((att) => att.id === attachmentId);

  if (att === undefined) {
    throw new Error('error fetching data');
  }

  return att;
}

export async function saveAttachments(
  procedureId: string,
  atts: Attachments[],
) {
  console.log('saving attachments for procedure: ', procedureId);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const procedure = procedures.find(
    (procedure) => procedure.id === procedureId,
  );

  if (!procedure) {
    throw new Error(`Procedure with id ${procedureId} not found`);
  }
  procedure.attachments.push(...atts);

  return procedure;
}

export async function deleteAttachment(procedureId: string, att: Attachments) {
  console.log('deleting attachment for procedure: ', procedureId);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const procedure = procedures.find(
    (procedure) => procedure.id === procedureId,
  );

  if (!procedure) {
    throw new Error(`Procedure with id ${procedureId} not found`);
  }

  procedure.attachments = procedure.attachments.filter(
    (attachment) => attachment.id !== att.id,
  );

  return procedure;
}
