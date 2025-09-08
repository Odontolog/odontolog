'use client';

import {
  Card,
  Text,
  Group,
  Menu,
  ActionIcon,
  Avatar,
  Loader,
  Center,
  Indicator,
  Box,
} from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { SupervisorAndReview } from '../models';
import SupervisorMenu from './supervisor-menu';
import { useQuery } from '@tanstack/react-query';
import { getProcedureSupervisors } from '@/features/procedure/requests';
import { useState } from 'react';

interface SupervisorSelectorProps {
  procedureId: string;
}

export default function SupervisorSelector({
  procedureId,
}: SupervisorSelectorProps) {
  const {
    data: supervisors,
    isLoading,
    isError,
    error,
  } = useQuery<SupervisorAndReview[]>({
    queryKey: ['procedureSupervisors', procedureId],
    queryFn: async () => getProcedureSupervisors(procedureId),
  });

  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  return (
    <Card withBorder shadow="sm" radius="md" w={220}>
      <Card.Section withBorder inheritPadding px="sm" py="xs">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            Supervisores
          </Text>
          <Menu
            withinPortal
            position="bottom"
            shadow="sm"
            opened={menuOpened}
            onChange={setMenuOpened}
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {supervisors && (
                <SupervisorMenu
                  procedureId={procedureId}
                  currentSupervisors={supervisors}
                  setMenuOpened={setMenuOpened}
                />
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Card.Section inheritPadding px="sm" py="sm">
        {isLoading && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}

        {isError && (
          <Text size="sm" c="red" py="md">
            Erro ao carregar supervisores:{' '}
            {error instanceof Error ? error.message : 'desconhecido'}
          </Text>
        )}

        {supervisors && supervisors.length === 0 && (
          <Text size="sm" c="dimmed">
            Nenhum supervisor selecionado
          </Text>
        )}
        {supervisors &&
          supervisors.map((supervisor) => (
            <Group key={supervisor.id} justify="space-between" mb="xs">
              <Group gap="xs">
                <Avatar src={supervisor.avatarUrl} size="xs" variant="filled" />
                <Text size="xs">{supervisor.name}</Text>
              </Group>
              <Indicator
                size={8}
                position="middle-center"
                color={
                  supervisor.lastReview.status === 'approved'
                    ? 'green'
                    : supervisor.lastReview.status === 'rejected'
                      ? 'red'
                      : supervisor.lastReview.status === 'draft'
                        ? 'gray'
                        : 'yellow'
                }
              >
                <Box w={8} h={8} />
              </Indicator>
            </Group>
          ))}
      </Card.Section>
    </Card>
  );
}
