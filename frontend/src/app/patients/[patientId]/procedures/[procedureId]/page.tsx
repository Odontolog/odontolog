import { getQueryClient } from '@/app/get-query-client';
import { getProcedureSupervisors } from '@/features/procedure/requests';
import SupervisorSelector from '@/features/procedure/ui/supervisor-selector';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function PatientProcedurePage({
  params,
}: {
  params: { patientId: string; procedureId: string };
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
