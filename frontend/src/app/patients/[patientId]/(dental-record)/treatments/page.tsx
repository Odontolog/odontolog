import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/get-query-client';
import { getPatientTratmentPlansOptions } from '@/features/treatment-plans/requests';
import PatientTreatmentPlans from '@/features/treatment-plans/treatment-plans';

interface PatientTreatmentPlansParams {
  patientId: string;
}

export default async function PatientTreatmentPlansPage({
  params,
}: {
  params: PatientTreatmentPlansParams;
}) {
  const { patientId } = await params;

  const queryClient = getQueryClient();
  console.log('opaaa');

  await queryClient.prefetchQuery(getPatientTratmentPlansOptions(patientId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientTreatmentPlans patientId={patientId} />
    </HydrationBoundary>
  );
}
