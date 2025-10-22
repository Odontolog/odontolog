'use client';

import { Box, Group, ScrollArea, Stack } from '@mantine/core';
import { type User } from 'next-auth';

import {
  getAnamneseOptions,
  saveAnamneseNotes,
} from '@/features/anamnese/requests';
import NotesSection from '@/shared/components/notes-section';
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
          <NotesSection
            id={patientId}
            queryOptions={options}
            mutateFn={saveAnamneseNotes}
          />
          <AnamneseSection patientId={patientId} queryOptions={options} />
        </Stack>
        <Box className={styles.side}>
          <AnamneseHistorySection />
        </Box>
      </Group>
    </ScrollArea>
  );
}
