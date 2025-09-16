import { getQueryClient } from '@/app/get-query-client';
import {
  getDetails,
  getProcedureSupervisors,
} from '@/features/procedure/requests';
import TreatmentPlanCreationProcedure from '@/features/procedure/ui/tpcp';
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

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['procedureSupervisors', procedureId],
      queryFn: async () => getProcedureSupervisors(procedureId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['procedureDetails', procedureId],
      queryFn: () => getDetails(procedureId),
    }),
  ]);

  return (
    <div style={{ padding: '24px' }}>
      <p>Página de um procedimento</p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TreatmentPlanCreationProcedure procedureId={procedureId} />
      </HydrationBoundary>
    </div>
  );
}
