import {
  supervisors,
  supervisorsAndReviews,
  setSupervisorsAndReviews,
} from '@/mocks/supervisor';
import { Supervisor, SupervisorAndReview } from './models';

export async function saveSupervisors(
  procedureId: string,
  selectedSupervisorIds: string[],
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const selectedSupervisors: Supervisor[] = supervisors.filter((supervisor) =>
    selectedSupervisorIds.includes(supervisor.id),
  );

  const selectedSupervisorsAndReviews: SupervisorAndReview[] =
    selectedSupervisors.map((sup) => {
      return {
        ...sup,
        lastReview: {
          note: '',
          grade: 0.0,
          status: 'draft',
        },
      };
    });

  setSupervisorsAndReviews(selectedSupervisorsAndReviews);

  console.log('Saved to backend (mock):', { procedureId, supervisors });
  return { success: true };
}

export async function getProcedureSupervisors(
  procedureId: string,
): Promise<SupervisorAndReview[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Fetching supervisors for procedure: ', procedureId);
  return supervisorsAndReviews;
}

export async function getAvailableSupervisors(): Promise<Supervisor[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return supervisors;
}
