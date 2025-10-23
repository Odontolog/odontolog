import { queryOptions } from '@tanstack/react-query';

import {
  mockAnamnese,
  updateMockAnamnese,
  updateMockAnamneseNotes,
} from '@/mocks/anamnese';
import { AnamneseFormValues } from './models';

export function getAnamneseOptions(patientId: string) {
  return queryOptions({
    queryKey: ['anamnese', patientId],
    queryFn: () => getAnamnese(patientId),
  });
}

export async function getAnamnese(patientId: string) {
  console.log(`Fetching data for patient's id ${patientId} anamnese.`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAnamnese;
}

export async function saveAnamneseNotes(patientId: string, value: string) {
  console.log(`Saving notes for patient ${patientId} anamnese.`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(value);
  updateMockAnamneseNotes(value);
}

export async function saveAnamnese(
  patientId: string,
  anamnese: AnamneseFormValues,
) {
  console.log(`Saving notes for patient ${patientId} anamnese.`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  updateMockAnamnese(anamnese);
}
