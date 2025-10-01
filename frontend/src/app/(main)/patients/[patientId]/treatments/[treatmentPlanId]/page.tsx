import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/get-query-client';
import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';
import TreatmentPlan from '@/features/treatment-plan/treatment-plan';
import { requireAuth } from '@/shared/utils';

interface TreatmentPlanParams {
  patientId: string;
  treatmentPlanId: string;
}

export default async function TreatmentPlanPage({
  params,
}: {
  params: TreatmentPlanParams;
}) {
  const { patientId, treatmentPlanId } = await params;

  const user = await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getTratmentPlanOptions(treatmentPlanId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TreatmentPlan
        user={user}
        patientId={patientId}
        treatmentPlanId={treatmentPlanId}
      />
    </HydrationBoundary>
  );
}
