import { queryOptions } from '@tanstack/react-query';

import { getAuthToken } from '@/shared/utils';
import { Student } from '@/shared/models';

export function getAllowedStudentsOptions(patientId: string) {
  return queryOptions({
    queryKey: ['allowedStudents', patientId],
    queryFn: () => getAllowedStudents(patientId),
  });
}

type StudentDTO = {
  id: string;
  email: string;
  name: string;
  clinicNumber: number;
  enrollmentCode: number;
  enrollmentYear: number;
  enrollmentSemester: number;
  avatarUrl: string;
};

export async function getAllowedStudents(
  patientId: string,
): Promise<Student[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/permissions`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar alunos autorizados.`);
  }

  const dtos = (await res.json()) as StudentDTO[];
  const data = dtos.map((dto) => ({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: 'STUDENT',
    clinic: dto.clinicNumber,
    enrollment: dto.enrollmentCode,
    semester: dto.enrollmentSemester,
    avatarUrl: dto.avatarUrl,
  }));

  return data as Student[];
}

export async function grantPermission(patientId: string, studentId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/permissions/${studentId}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao revogar permissão do aluno.`);
  }
}

export async function removePermission(patientId: string, studentId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/permissions/${studentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao revogar permissão do aluno.`);
  }
}
