import { mockReviewables } from '@/mocks/reviewables';
import { ProcedureShort, TreatmentPlanShort } from '@/shared/models';
import { queryOptions } from '@tanstack/react-query';

export function getValidationsOptions(supervisorId: string) {
  return queryOptions({
    queryKey: ['validations', supervisorId],
    queryFn: () => getValidations(supervisorId),
  });
}

async function getValidations(
  supervisorId: string,
): Promise<Array<TreatmentPlanShort | ProcedureShort>> {
  console.log(`Fetching data for reviewables for ${supervisorId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockReviewables;
}
