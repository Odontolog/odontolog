'use client';

import {
  Card,
  Text,
  Group,
  Loader,
  Center,
  Flex,
  ThemeIcon,
  Divider,
  Timeline,
} from '@mantine/core';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { IconExclamationCircle } from '@tabler/icons-react';

import { Reviewable } from '@/shared/models';
import ActivityItem from './activity-item';

interface HistorySectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export default function HistorySection<T extends Reviewable>({
  queryOptions,
}: HistorySectionProps<T>) {
  const {
    data: history,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.history,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Histórico de atividades
          </Text>
        </Group>
      </Card.Section>

      <Divider my="none" />

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
              Erro ao carregar dados.
            </Text>
          </Flex>
        )}

        {history && history.length === 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Nenhuma atividade realizada.
          </Text>
        )}

        <Timeline bulletSize={24} lineWidth={3}>
          {history &&
            history.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
        </Timeline>
      </Card.Section>
    </Card>
  );
}
