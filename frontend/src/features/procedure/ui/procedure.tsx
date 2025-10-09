'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { type User } from 'next-auth';

import { getProcedureOptions } from '../requests';
import TeethSection from './teeth-section';

interface ProcedureProps {
  patientId: string;
  procedureId: string;
  user: User;
}

export default function Procedure({ procedureId }: ProcedureProps) {
  const options = getProcedureOptions(procedureId);

  const mode = 'edit';

  const { data: status } = useSuspenseQuery({
    ...options,
    select: (data) => data.status,
  });

  return (
    <>
      {status}
      <TeethSection
        procedureId={procedureId}
        mode={mode}
        queryOptions={options}
      />
    </>
  );
}
