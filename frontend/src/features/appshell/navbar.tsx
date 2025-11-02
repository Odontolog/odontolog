'use client';

import { ActionIcon, Group, Menu, Avatar } from '@mantine/core';
import { IconPlus, IconUser, IconUserPlus, IconUsers } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

import styles from './navbar.module.css';
import SearchTrigger from './search-trigger';
import RecordModal from '../patient/record-modal';
import StudentRecordModal from '../student/record-modal';
import SupervisorRecordModal from '../supervisor/record-modal';
import { useState } from 'react';

type ModalType = 'patient' | 'student' | 'supervisor' | null;

export default function Navbar() {
  const { data } = useSession();
  const [openedModal, setOpenedModal] = useState<ModalType>(null);

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
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="default">
                    <IconPlus size={14} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Criar novo registro</Menu.Label>
                  <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => setOpenedModal('patient')}
                  >
                    Paciente
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUserPlus size={14} />}
                    onClick={() => setOpenedModal('student')}
                  >
                    Aluno
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUsers size={14} />}
                    onClick={() => setOpenedModal('supervisor')}
                  >
                    Supervisor
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <RecordModal
                opened={openedModal === 'patient'}
                onClose={() => setOpenedModal(null)}
              />
              <StudentRecordModal
                opened={openedModal === 'student'}
                onClose={() => setOpenedModal(null)}
              />
              <SupervisorRecordModal
                opened={openedModal === 'supervisor'}
                onClose={() => setOpenedModal(null)}
              />
            </>
          )}
          <Avatar
            component="a"
            href={`/students/${user?.id}`}
            color="initials"
            name={user?.name}
            src={user?.photoUrl}
          />
        </Group>
      </Group>
    </nav>
  );
}
