'use client';

import { Box, Group, Loader, ScrollArea, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type User } from 'next-auth';
import { notFound } from 'next/navigation';

import { getProcedureOptions } from '@/features/procedure/requests';
import { getProcedurePageMode } from '@/features/procedure/utils';
import { ServerError } from '@/shared/components/server-error';
import AssigneeSection from '@/shared/reviewable/assignee-section';
import HistorySection from '@/shared/reviewable/history/history-section';
import NotesSection from '@/shared/reviewable/notes-section';
import SupervisorSection from '@/shared/reviewable/supervisor-section';
import AttachmentsSection from './attachements/atts-section';
import DiagnosticSection from './diagnostic-section';
import ProcedureHeader from './header';
import styles from './procedure.module.css';
import StudySectorSection from './study-sector-section';
import TeethSection from './teeth-section';

interface ProcedureProps {
  patientId: string;
  procedureId: string;
  user: User;
}

export default function Procedure({
  patientId,
  procedureId,
  user,
}: ProcedureProps) {
  const options = getProcedureOptions(procedureId);

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
          Carregando Procedimento
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

  const mode = getProcedurePageMode(status, user.role);

  return (
    <>
      <ProcedureHeader
        procedureId={procedureId}
        queryOptions={options}
        user={user}
      />
      <ScrollArea w="100%" style={{ flex: 1 }}>
        <Group className={styles.container}>
          <Stack className={styles.main}>
            <DiagnosticSection
              procedureId={procedureId}
              queryOptions={options}
              mode={mode}
            />
            <NotesSection
              reviewableId={procedureId}
              queryOptions={options}
              mode={mode}
            />
            <AttachmentsSection
              patientId={patientId}
              procedureId={procedureId}
              mode={mode}
              queryOptions={options}
            />
            <HistorySection
              reviewableId={procedureId}
              queryOptions={options}
              mode={mode}
            />
          </Stack>

          <Stack className={styles.side}>
            <SupervisorSection
              reviewableId={procedureId}
              queryOptions={options}
              mode={mode}
            />
            <AssigneeSection
              reviewableId={procedureId}
              queryOptions={options}
              mode={status === 'IN_PROGRESS' ? 'read' : mode}
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
          </Stack>
        </Group>
      </ScrollArea>
    </>
  );
}
