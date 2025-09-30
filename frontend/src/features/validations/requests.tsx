import { mockReviewables } from '@/mocks/reviewables';
import { ReviewableShort } from '@/shared/models';

import { queryOptions } from '@tanstack/react-query';

export function getValidationsOptions() {
  return queryOptions({
    queryKey: ['validations'],
    queryFn: () => getValidations(),
  });
}

async function getValidations(): Promise<ReviewableShort[]> {
  console.log(`Fetching data for reviewables`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockReviewables;
}
