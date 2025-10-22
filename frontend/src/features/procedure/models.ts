import { UseQueryOptions } from '@tanstack/react-query';

import { Mode, Procedure } from '@/shared/models';

export interface ProcedureSectionProps {
  procedureId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  mode: Mode;
}
