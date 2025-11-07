import { Student } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { notFound } from 'next/navigation';

export async function getStudentById(studentId: string): Promise<Student> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.BACKEND_URL}/students/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status >= 500) {
    throw new Error(`Erro ao buscar plano: ${res.status}`);
  } else if (res.status >= 400) {
    notFound();
  }

  const data = (await res.json()) as Student;
  return data;
}
