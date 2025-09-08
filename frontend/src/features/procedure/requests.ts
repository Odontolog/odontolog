import {
  supervisors,
  supervisorsAndReviews,
  setSupervisorsAndReviews,
} from '@/mocks/supervisor';
import { ProcedureDetail, Supervisor, SupervisorAndReview } from './models';

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

let Superdata: ProcedureDetail = {
  notes: 'something',
  diagnostic: 'opaopaopa',
};

export async function getDetails(
  procedureId: string,
): Promise<ProcedureDetail> {
  console.log('fething detail for procedureID: ', procedureId);
  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.log(Superdata);
  return Superdata;
}

export async function saveDetails(procedureId: string, data: ProcedureDetail) {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.log('saving data', data, procedureId);
  // throw new Error('error saving data');
  Superdata = data;
}
