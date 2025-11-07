import { Student } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';

export async function getStudents(): Promise<Student[]> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar alunos.`);
  }

  return (await res.json()) as Student[];
}
