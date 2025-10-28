import { notFound } from 'next/navigation';
import { queryOptions } from '@tanstack/react-query';

import { Procedure, ProcedureShort } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToProcedureShort, ProcedureShortDto } from './mappers';
import { Appointment } from './models';

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

export function getNextAppointmentOptions(patientId: string) {
  return queryOptions({
    queryKey: ['nextAppointmentDate', patientId],
    queryFn: () => getNextAppointment(patientId),
  });
}

export async function getNextAppointment(patientId: string): Promise<Date | null> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/next-appointment`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(
      `[${res.status}] Erro ao pegar os dados da próxima consulta.`,
    );
  }

  const data = (await res.json()) as Appointment;
  
  // Se appointmentDate for null, retorna null em vez de Invalid Date
  if (data.appointmentDate === null || data.appointmentDate === undefined) {
    return null;
  }
  
  return new Date(`${data.appointmentDate}T00:00:00`);
}

export async function saveNextAppointment(
  date: Date | undefined,
  patientId: string,
) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/next-appointment`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentDate: date }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `[${res.status}] Erro ao salvar a data da próxima consulta.`,
    );
  }
}
