import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/get-query-client';
import { getProcedureOptions } from '@/features/procedure/requests';
import Procedure from '@/features/procedure/ui/procedure';
import { requireAuth } from '@/shared/utils';

interface ProcedureParams {
  patientId: string;
  procedureId: string;
}

export default async function ProcedurePage({
  params,
}: {
  params: ProcedureParams;
}) {
  const { procedureId, patientId } = await params;
  const user = await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getProcedureOptions(procedureId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Procedure patientId={patientId} user={user} procedureId={procedureId} />
    </HydrationBoundary>
  );
}
