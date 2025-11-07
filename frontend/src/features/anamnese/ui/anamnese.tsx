'use client';

import { Box, Group, ScrollArea, Stack } from '@mantine/core';
import { type User } from 'next-auth';

import {
  getAnamneseOptions,
  getSaveAnamneseStringFieldFn,
  saveAnamneseNotes,
} from '@/features/anamnese/requests';
import NotesSection from '@/shared/components/notes-section';
import StringFieldSection from '@/shared/components/string-field-section';
import AnamneseHistorySection from './anamnese-history-section';
import AnamneseSection from './anamnese-section';
import styles from './anamnese.module.css';

interface AnamneseProps {
  patientId: string;
  user: User;
}

export default function Anamnese({ patientId }: AnamneseProps) {
  const options = getAnamneseOptions(patientId);

  return (
    <ScrollArea w="100%" h="100%" offsetScrollbars scrollbars="y">
      <Group className={styles.container}>
        <Stack flex="1" h="100%">
          <StringFieldSection
            id={patientId}
            title="Queixa Principal"
            queryOptions={options}
            mutateFn={getSaveAnamneseStringFieldFn(
              'main-complaint',
              'mainComplaint',
            )}
            selectFn={(data) => data.mainComplaint}
          />
          <StringFieldSection
            id={patientId}
            title="História da Doença Atual"
            queryOptions={options}
            mutateFn={getSaveAnamneseStringFieldFn(
              'hpi',
              'historyOfPresentIllness',
            )}
            selectFn={(data) => data.historyOfPresentIllness}
          />
          <AnamneseSection patientId={patientId} queryOptions={options} />
          <StringFieldSection
            id={patientId}
            title="Antecedentes"
            queryOptions={options}
            mutateFn={getSaveAnamneseStringFieldFn(
              'antecedents',
              'antecedents',
            )}
            selectFn={(data) => data.antecedents}
          />
          <NotesSection
            id={patientId}
            queryOptions={options}
            mutateFn={saveAnamneseNotes}
          />
        </Stack>
        <Box className={styles.side}>
          <AnamneseHistorySection queryOptions={options} />
        </Box>
      </Group>
    </ScrollArea>
  );
}
