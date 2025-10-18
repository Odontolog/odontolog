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
import { useQuery } from '@tanstack/react-query';

import { Activity, Reviewable } from '@/shared/models';
import { ReviewableSectionProps } from '@/shared/reviewable/models';
import { getActivityTitleFn } from '../utils';
import ActivityItem from './activity-item';

export default function HistorySection<T extends Reviewable>({
  queryOptions,
}: ReviewableSectionProps<T>) {
  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    select: (data) => ({
      history: data.history,
      type: data.type,
    }),
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
        <HistorySectionContent
          history={data?.history}
          type={data?.type}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface HistorySectionContentProps {
  history?: Activity[];
  type?: Reviewable['type'];
  isLoading: boolean;
  isError: boolean;
}

function HistorySectionContent(props: HistorySectionContentProps) {
  const { history, isLoading, isError, type } = props;

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

  if (history === undefined || type === undefined) {
    return null;
  }

  if (history.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhuma atividade realizada.
      </Text>
    );
  }

  const activityTitleFn = getActivityTitleFn(type);

  return (
    <Timeline bulletSize={24} lineWidth={3}>
      {history
        .sort((a, b) => +a.createdAt - +b.createdAt)
        .map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            getActivityTitle={activityTitleFn}
          />
        ))}
    </Timeline>
  );
}
