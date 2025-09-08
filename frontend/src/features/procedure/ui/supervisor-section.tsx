'use client';

import {
  Card,
  Text,
  Group,
  Avatar,
  Loader,
  Center,
  Indicator,
  Box,
  Flex,
  ThemeIcon,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { SupervisorAndReview } from '../models';
import SupervisorMenu from './supervisor-menu';
import { useQuery } from '@tanstack/react-query';
import { getProcedureSupervisors } from '@/features/procedure/requests';

interface SupervisorSectionProps {
  procedureId: string;
}

export default function SupervisorSection({
  procedureId,
}: SupervisorSectionProps) {
  const {
    data: supervisors,
    isLoading,
    isError,
  } = useQuery<SupervisorAndReview[]>({
    queryKey: ['procedureSupervisors', procedureId],
    queryFn: async () => getProcedureSupervisors(procedureId),
  });

  return (
    <Card withBorder shadow="sm" radius="md" w={220}>
      <Card.Section withBorder inheritPadding px="sm" py="xs">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            Supervisores
          </Text>
          {supervisors && (
            <SupervisorMenu
              procedureId={procedureId}
              currentSupervisors={supervisors}
            />
          )}
        </Group>
      </Card.Section>

      <Card.Section inheritPadding p="md">
        {isLoading && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}

        {isError && (
          <Flex align="center" gap="xs">
            <ThemeIcon variant="white" color="red">
              <IconExclamationCircle size={24} />
            </ThemeIcon>
            <Text size="sm" c="red" py="none">
              Erro ao carregar supervisores
            </Text>
          </Flex>
        )}

        {supervisors && supervisors.length === 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Nenhum supervisor selecionado
          </Text>
        )}

        <Flex gap="xs" direction="column">
          {supervisors &&
            supervisors.map((supervisor) => (
              <Group key={supervisor.id} justify="space-between" gap="xs">
                <Group gap="xs">
                  <Avatar
                    src={supervisor.avatarUrl}
                    size="xs"
                    variant="filled"
                  />
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
        </Flex>
      </Card.Section>
    </Card>
  );
}
