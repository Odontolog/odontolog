import { notFound } from 'next/navigation';

import { Patient } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToPatient, PatientDTO } from './mappers';

export async function getPatientById(patientId: string): Promise<Patient> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}`,
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
  const data = (await res.json()) as PatientDTO;
  return mapToPatient(data);
}
