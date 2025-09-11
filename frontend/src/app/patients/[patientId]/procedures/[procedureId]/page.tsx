import { getQueryClient } from '@/app/get-query-client';
import { getProcedureSupervisors } from '@/features/procedure/requests';
import ProcedureHeader from '@/features/procedure/ui/procedure-header';
import SupervisorSection from '@/features/procedure/ui/supervisor-section';
import { Box } from '@mantine/core';
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
    <div>
      <ProcedureHeader
        mode="edit"
        type="treatmentPlan"
        id={2}
        status="finished"
        creationDate={new Date()}
        studentName="Pedro Sebastião"
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Box style={{ padding: '24px' }}>
          <SupervisorSection procedureId={procedureId} />
        </Box>
      </HydrationBoundary>
    </div>
  );
}
