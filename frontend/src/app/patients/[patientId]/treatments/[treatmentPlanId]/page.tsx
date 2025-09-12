import { getQueryClient } from '@/app/get-query-client';
import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';
import TreatmentPlan from '@/features/treatment-plan/treatment-plan';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

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

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getTratmentPlanOptions(treatmentPlanId));

  return (
    <div style={{ padding: '24px' }}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TreatmentPlan
          patientId={patientId}
          treatmentPlanId={treatmentPlanId}
        />
      </HydrationBoundary>
    </div>
  );
}
