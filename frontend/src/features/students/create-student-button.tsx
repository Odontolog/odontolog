'use client';

import { Button } from '@mantine/core';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';

import StudentModal from './student-modal';

export default function CreateStudentButton() {
  const [opened, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setOpen(true)}
        w={{ base: '100%', md: 'auto' }}
      >
        Novo aluno
      </Button>
      <StudentModal opened={opened} onClose={() => setOpen(false)} />
    </>
  );
}
