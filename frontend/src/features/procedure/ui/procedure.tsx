'use client';

import { getProcedureOptions } from '../requests';
import TeethSection from './teeth-section';

interface ProcedureProps {
  procedureId: string;
}

export default function Procedure({ procedureId }: ProcedureProps) {
  const options = getProcedureOptions(procedureId);

  const mode = 'edit';

  return (
    <TeethSection
      procedureId={procedureId}
      mode={mode}
      queryOptions={options}
    />
  );
}
