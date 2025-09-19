import { ProcedureDetail } from './models';

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
