import { notFound } from 'next/navigation';

import { Patient } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToPatient, PatientDTO } from './mappers';
import { PatientRecordForm } from './models';

export async function getPatientById(patientId: string): Promise<Patient> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.BACKEND_URL}/patients/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar plano: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }
  const data = (await res.json()) as PatientDTO;
  return mapToPatient(data);
}

export async function createPatientRecord(
  patient: PatientRecordForm,
): Promise<Patient> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patient),
  });

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao criar paciente.`);
  }

  const data: Patient = (await res.json()) as Patient;
  return data;
}

export async function editPatientRecord(
  patient: PatientRecordForm,
): Promise<Patient> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patient.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patient),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao editar o paciente.`);
  }

  const data: Patient = (await res.json()) as Patient;
  return data;
}
