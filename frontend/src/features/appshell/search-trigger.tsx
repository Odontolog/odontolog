'use client';

import { ActionIcon, Code, TextInput, UnstyledButton } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';

import styles from './navbar.module.css';

interface SearchTriggerProps {
  variant?: 'desktop' | 'mobile';
}

export default function SearchTrigger({
  variant = 'desktop',
}: SearchTriggerProps) {
  if (variant === 'mobile') {
    return (
      <ActionIcon
        onClick={spotlight.open}
        variant="default"
        size="lg"
        aria-label="Pesquisar pacientes"
        color="gray"
      >
        <IconSearch />
      </ActionIcon>
    );
  }

  return (
    <UnstyledButton onClick={spotlight.open} style={{ width: 300 }}>
      <TextInput
        readOnly
        placeholder="Buscar por Paciente..."
        size="sm"
        leftSection={<IconSearch size={14} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={styles.searchCode}>Ctrl + K</Code>}
        style={{ cursor: 'pointer', pointerEvents: 'none' }}
      />
    </UnstyledButton>
  );
}
