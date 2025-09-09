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
  notes: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
};

export async function getDetails(
  procedureId: string,
): Promise<ProcedureDetail> {
  console.log('fething detail for procedureID: ', procedureId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(Superdata);
  return Superdata;
}

export async function saveDetails(procedureId: string, data: ProcedureDetail) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('saving data', data, procedureId);
  // throw new Error('error saving data');
  Superdata = data;
  return Superdata;
}
