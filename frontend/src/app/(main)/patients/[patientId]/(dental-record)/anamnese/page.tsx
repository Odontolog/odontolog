import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/get-query-client';
import { getAnamneseOptions } from '@/features/anamnese/requests';
import Anamnese from '@/features/anamnese/ui/anamnese';
import { requireAuth } from '@/shared/utils';

export default async function PatientAnamnesePage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;

  const user = await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getAnamneseOptions(patientId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Anamnese user={user} patientId={patientId} />
    </HydrationBoundary>
  );
}
