import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { attachments, procedures } from '@/mocks/treatment-plan';
import { Attachments, Procedure, ProcedureDetail } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToProcedure, ProcedureDto } from './mapper';

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

export async function startProcedure(procedureId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/${procedureId}/start`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao iniciar procedimento.`);
  }
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
}

export async function saveDiagnostic(procedureId: string, diagnostic: string) {
  const token = await getAuthToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/${procedureId}/diagnostic`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ diagnostic }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar diagnóstico.`);
  }
}

export async function saveDetails(procedureId: string, data: ProcedureDetail) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('saving data', data, procedureId);
  // throw new Error('error saving data');
  return { success: true };
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
