import { Supervisor, User } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';
import { ReviewFormValues } from './models';

export async function getAvailableUsers(): Promise<User[]> {
  const token = await getAuthToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao carregar alunos.`);
  }

  return (await res.json()) as User[];
}

export async function saveAssignee(reviewableId: string, assigneeId: string) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/${reviewableId}/assignee`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: assigneeId }),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao salvar encarregado.`);
  }

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

export async function submitReviewRequest(
  reviewableId: string,
  comments: string,
) {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/${reviewableId}/submit-for-review`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comments }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `[${res.status}] Erro ao submeter plano de tratamento para validação.`,
    );
  }
}

type SupervisorReviewDto = {
  comments: string;
  grade: number;
  approved: boolean;
};

export async function submitReview(
  reviewableId: string,
  review: ReviewFormValues,
) {
  const token = await getAuthToken();

  const payload: SupervisorReviewDto = {
    comments: review.comments,
    grade: review.grade ?? 0,
    approved: review.decision === 'Aprovar',
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/${reviewableId}/reviews/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao submeter revisão.`);
  }
}
