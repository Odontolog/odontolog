import { getAuthToken } from '@/shared/utils';
import { StudentRecordForm } from './models';

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  clinicNumber: number;
  enrollmentCode: string;
  enrollmentYear: number;
  enrollmentSemester: number;
  avatarUrl?: string;
}

export async function createStudentRecord(
  student: StudentRecordForm,
): Promise<StudentResponse> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(student),
  });

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao criar aluno.`);
  }

  const data = (await res.json()) as StudentResponse;
  return data;
}
