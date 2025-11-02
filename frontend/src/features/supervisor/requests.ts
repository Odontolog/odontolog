import { getAuthToken } from '@/shared/utils';
import { SupervisorRecordForm } from './models';

export interface SupervisorResponse {
  id: string;
  name: string;
  email: string;
  specialization: string;
  siape: string;
}

export async function createSupervisorRecord(
  supervisor: SupervisorRecordForm,
): Promise<SupervisorResponse> {
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/supervisors`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supervisor),
    },
  );

  if (!res.ok) {
    throw new Error(`[${res.status}] Erro ao criar supervisor.`);
  }

  const data = (await res.json()) as SupervisorResponse;
  return data;
}
