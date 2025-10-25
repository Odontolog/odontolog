import { queryOptions } from '@tanstack/react-query';

import { allowedStudents } from '@/mocks/students';

export function getAllowedStudentsOptions(patientId: string) {
  return queryOptions({
    queryKey: ['allowedStudents', patientId],
    queryFn: () => getAllowedStudents(patientId),
  });
}

export async function getAllowedStudents(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetching students allowed to access patient(${patientId})`);
  return allowedStudents;
}

export async function saveAllowedStudents(
  patientId: string,
  allowedStudentIds: string[],
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `give permission to students (${allowedStudentIds.join(', ')}) for accessing patient(${patientId})`,
  );
}

export async function removePermission(patientId: string, studentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `removing permission from students (${studentId}) on patient(${patientId})`,
  );
}
