'use client';

import { ActionIcon, Avatar, Group, Menu } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import styles from './navbar.module.css';
import SearchTrigger from './search-trigger';
import RecordModal from '../patient/record-modal';
import SupervisorModal from '../supervisors/supervisor-modal';
import StudentModal from '../students/student-modal';

export default function Navbar() {
  const { data } = useSession();
  const [opened, setOpen] = useState<boolean>(false);
  const [supervisorModalOpen, setSupervisorModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  const user = data?.user;

  return (
    <nav className={styles.navbar}>
      <Group justify="space-between" h="100%">
        <div className={styles.search}>
          <SearchTrigger variant="desktop" />
        </div>
        <Group>
          {user?.role !== 'STUDENT' && (
            <>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="default">
                    <IconPlus size={14} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => setOpen(true)}>
                    Novo Paciente
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setSupervisorModalOpen(true)}
                    color="blue"
                  >
                    Novo Supervisor
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setStudentModalOpen(true)}
                    color="green"
                  >
                    Novo Aluno
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <RecordModal opened={opened} onClose={() => setOpen(false)} />
              <SupervisorModal
                opened={supervisorModalOpen}
                onClose={() => setSupervisorModalOpen(false)}
              />
              <StudentModal
                opened={studentModalOpen}
                onClose={() => setStudentModalOpen(false)}
              />
            </>
          )}
          <Avatar
            component="a"
            href={user?.role === 'STUDENT' ? `/students/${user?.id}` : ''}
            color="initials"
            name={user?.name}
            src={user?.photoUrl}
          />
        </Group>
      </Group>
    </nav>
  );
}
