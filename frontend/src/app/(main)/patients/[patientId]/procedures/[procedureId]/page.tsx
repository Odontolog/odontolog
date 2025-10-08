import { getQueryClient } from '@/app/get-query-client';
import Procedure from '@/features/procedure/ui/procedure';
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
  const { procedureId, patientId } = await params;

  const queryClient = getQueryClient();

  return (
    <div style={{ padding: '24px' }}>
      <p>
        Página de um procedimento id={procedureId},{patientId}
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Procedure procedureId={procedureId} />
      </HydrationBoundary>
    </div>
  );
}
