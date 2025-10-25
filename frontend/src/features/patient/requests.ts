import { notFound } from 'next/navigation';

import { Patient } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { mapToPatient, PatientDTO } from './mappers';
import { PatientRecordForm } from './models';

export async function checkPermission(
  patientId: string,
  userId: string,
): Promise<boolean> {
  console.log(
    `Checking if user(${userId}) has permission to access patient(${patientId})...`,
  );
  await new Promise((resolve) => setTimeout(resolve, 2500));
  if (patientId === '1') {
    return true;
  }
  return false;
}

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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('creating a new patient record, ', patient);

  return patient as Patient;
}

export async function editPatientRecord(
  patient: PatientRecordForm,
): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('editing a patient record, ', patient);

  return patient as Patient;
}
