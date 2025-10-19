'use client';

import { Box, Loader, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type User } from 'next-auth';
import { notFound } from 'next/navigation';

import { ServerError } from '@/shared/components/server-error';
import { getProcedureOptions } from '../requests';
import AttachmentsSection from './attachements/atts-section';
import StudySectorSection from './study-sector-section';
import TeethSection from './teeth-section';

interface ProcedureProps {
  patientId: string;
  procedureId: string;
  user: User;
}

export default function Procedure({ procedureId, user }: ProcedureProps) {
  const options = getProcedureOptions(procedureId);

  const mode = 'edit';

  const {
    data: status,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...options,
    select: (data) => data.status,
  });

  if (isLoading) {
    return (
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack align="center" mt={100} style={{ height: '100%' }}>
          <Loader size="lg" />
          Carregando Plano de Tratamento
        </Stack>
      </Box>
    );
  }

  if (isError) {
    if (error instanceof TypeError) {
      return (
        <div>
          <ServerError
            title="Algo de errado aconteceu"
            description="Nosso servidor não conseguiu suportar essa requisição. Tente recarregar a página."
          />
        </div>
      );
    }
    notFound();
  }

  if (status === undefined) {
    return null;
  }

  return (
    <>
      {status}
      <AttachmentsSection
        user={user}
        reviewableId={procedureId}
        mode={mode}
        queryOptions={options}
      />
      <TeethSection
        procedureId={procedureId}
        mode={mode}
        queryOptions={options}
      />
      <StudySectorSection
        procedureId={procedureId}
        mode={mode}
        queryOptions={options}
      />
    </>
  );
}
