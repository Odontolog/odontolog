'use client';
import { type User } from 'next-auth';
import { getProcedureOptions } from './requests';

import AttachmentsSection from './ui/attachements/atts-section';

interface ProcedureProps {
  patientId: string;
  procedureId: string;
  user: User;
}

export default function Procedure({ procedureId, user }: ProcedureProps) {
  const options = getProcedureOptions(procedureId);
  const mode = 'edit';

  return (
    <>
      <>header</>

      <AttachmentsSection
        user={user}
        reviewableId={procedureId}
        mode={mode}
        queryOptions={options}
      />
    </>
  );
}
