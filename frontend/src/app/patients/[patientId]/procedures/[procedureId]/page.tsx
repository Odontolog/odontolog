import { getQueryClient } from '@/app/get-query-client';
import { Box } from '@mantine/core';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  getDetails,
  getProcedureSupervisors,
} from '@/features/procedure/requests';
import ProcedureHeader from '@/features/procedure/ui/procedure-header';
import TreatmentPlanCreationProcedure from '@/features/procedure/ui/tpcp';

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
    <div>
      <ProcedureHeader
        mode="edit"
        type="treatmentPlan"
        patientId={patientId}
        procedureId={procedureId}
      />
      <Box style={{ padding: 'var(--mantine-spacing-md)' }}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TreatmentPlanCreationProcedure procedureId={procedureId} />
        </HydrationBoundary>
      </Box>
    </div>
  );
}
