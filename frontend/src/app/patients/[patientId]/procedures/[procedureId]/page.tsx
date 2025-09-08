import { getQueryClient } from '@/app/get-query-client';
import { getProcedureSupervisors } from '@/features/procedure/requests';
import SupervisorSelector from '@/features/procedure/ui/supervisor-selector';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface ProcedureParams {
  patientId: string;
  procedureId: string;
}

export default async function ProcedurePage({
  params,
}: {
  params: ProcedureParams;
}) {
  const { procedureId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['procedureSupervisors', procedureId],
    queryFn: async () => getProcedureSupervisors(procedureId),
  });

  return (
    <div style={{ padding: '24px' }}>
      <p>Página de um procedimento</p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SupervisorSelector procedureId={procedureId} />
      </HydrationBoundary>
    </div>
  );
}
