import { queryOptions } from '@tanstack/react-query';

import { treatmentPlanMock } from '@/mocks/treatment-plan';
import { TreatmentPlan } from '@/shared/models';
import { createReviewableOptions } from '@/shared/reviewable/requests';

export function getTratmentPlanOptions(treatmentPlanId: string) {
  return queryOptions({
    queryKey: ['treatmentPlan', treatmentPlanId],
    queryFn: () => getTreatmentPlan(treatmentPlanId),
  });
}

export function getTreatmentPlanReviewableOptions(treatmentPlanId: string) {
  return createReviewableOptions(['treatmentPlan', treatmentPlanId], () =>
    getTreatmentPlan(treatmentPlanId),
  );
}

async function getTreatmentPlan(
  treatmentPlanId: string,
): Promise<TreatmentPlan> {
  console.log(`Fetching data for treatment plan ${treatmentPlanId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return treatmentPlanMock;
}
