import { students } from '@/mocks/students';
import { updateAssignee } from '@/mocks/treatment-plan';
import { Supervisor, User } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';

export async function getAvailableUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return students;
}

export async function saveAssignee(id: string, selectedAssigneeId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Saved to backend (mock):', { id, selectedAssigneeId });

  const assignee = students.find((s) => s.id === selectedAssigneeId);

  if (!assignee) {
    throw new Error('User not found.');
  }

  updateAssignee(assignee);

  return { success: true };
}

export async function getAvailableSupervisors(): Promise<Supervisor[]> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/supervisors`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar supervisores.`);
  }

  return (await res.json()) as Supervisor[];
}

export async function saveSupervisors(
  reviewableId: string,
  selectedSupervisorIds: string[],
) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/${reviewableId}/reviewers`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ supervisorIds: selectedSupervisorIds }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar supervisores.`);
  }

  return { success: true };
}

export async function saveDetails(reviewableId: string, notes: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/${reviewableId}/notes`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar observações.`);
  }

  return { success: true };
}
