'use client';

import { Button } from '@mantine/core';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';

import RecordModal from '@/features/patient/record-modal';

export default function CreatePatientButton() {
  const [opened, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setOpen(true)}
        w={{ base: '100%', md: 'auto' }}
      >
        Novo paciente
      </Button>
      <RecordModal opened={opened} onClose={() => setOpen(false)} />
    </>
  );
}
