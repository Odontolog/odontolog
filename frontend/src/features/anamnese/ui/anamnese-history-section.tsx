'use client';

import {
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Anamnese, AnamneseActivity } from '../models';
import AnamneseActivityItem from './anamnese-activity-item';

export interface AnamneseHistorySectionProps {
  queryOptions: UseQueryOptions<Anamnese, Error, Anamnese, string[]>;
}

export default function AnamneseHistorySection({
  queryOptions,
}: AnamneseHistorySectionProps) {
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
            Histórico de modificações
          </Text>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <AnamneseHistorySectionContent
          history={history}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface AnamneseHistorySectionContentProps {
  history?: AnamneseActivity[];
  isLoading: boolean;
  isError: boolean;
}

function AnamneseHistorySectionContent(
  props: AnamneseHistorySectionContentProps,
) {
  const { history, isLoading, isError } = props;

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Stack align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar histórico
        </Text>
      </Stack>
    );
  }

  if (history === undefined) {
    return null;
  }

  if (history.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhuma modificação realizada.
      </Text>
    );
  }

  return (
    <Timeline bulletSize={24} lineWidth={3}>
      {history
        .sort((a, b) => +a.createdAt - +b.createdAt)
        .map((activity) => (
          <AnamneseActivityItem key={activity.id} activity={activity} />
        ))}
    </Timeline>
  );
}
