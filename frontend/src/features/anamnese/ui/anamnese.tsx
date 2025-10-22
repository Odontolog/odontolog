'use client';

import { Box, Group, Stack } from '@mantine/core';
import { type User } from 'next-auth';

import {
  getAnamneseOptions,
  saveAnamneseNotes,
} from '@/features/anamnese/requests';
import NotesSection from '@/shared/components/notes-section';
import AnamneseSection from './anamnese-section';
import styles from './anamnese.module.css';
import AnamneseHistorySection from './anamnese-history-section';

interface AnamneseProps {
  patientId: string;
  user: User;
}

export default function Anamnese({ patientId }: AnamneseProps) {
  const options = getAnamneseOptions(patientId);

  return (
    <Group
      align="flex-start"
      py="md"
      px="lg"
      flex="1"
      className={styles.container}
    >
      <Stack flex="1" h="100%">
        <AnamneseSection patientId={patientId} queryOptions={options} />
        <NotesSection
          id={patientId}
          queryOptions={options}
          mutateFn={saveAnamneseNotes}
        />
      </Stack>
      <Box className={styles.side}>
        <AnamneseHistorySection />
      </Box>
    </Group>
  );
}
