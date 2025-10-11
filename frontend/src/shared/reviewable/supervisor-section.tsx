'use client';

import {
  Avatar,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { StatusIndicator } from '@/shared/components/status';
import { Reviewable } from '@/shared/models';
import { ReviewableSectionProps, SupervisorReviewStatus } from './models';
import SupervisorMenu from './supervisor-menu';
import { getSupervisorReviewStatus } from './utils';

export default function SupervisorSection<T extends Reviewable>({
  reviewableId,
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const {
    data: supervisors,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => getSupervisorReviewStatus(data.reviews, data.reviewers),
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Supervisores
          </Text>
          {mode === 'edit' && supervisors && (
            <SupervisorMenu
              reviewableId={reviewableId}
              queryOptions={queryOptions}
              supervisors={supervisors}
            />
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <SupervisorSectionContent
          supervisors={supervisors}
          isError={isError}
          isLoading={isLoading}
        />
      </Card.Section>
    </Card>
  );
}

interface SupervisorSectionContentProps {
  supervisors?: SupervisorReviewStatus[];
  isLoading: boolean;
  isError: boolean;
}

export function SupervisorSectionContent(props: SupervisorSectionContentProps) {
  const { supervisors, isLoading, isError } = props;

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Flex align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar supervisores
        </Text>
      </Flex>
    );
  }

  if (!supervisors) {
    return null;
  }

  if (supervisors.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhum supervisor selecionado
      </Text>
    );
  }

  return (
    <Flex gap="xs" direction="column">
      {supervisors.map((supervisor) => (
        <Group key={supervisor.id} justify="space-between" gap="xs">
          <Group gap="xs">
            <Avatar src={supervisor.avatarUrl} size="sm" variant="filled" />
            <Text size="sm">{supervisor.name}</Text>
          </Group>
          <StatusIndicator status={supervisor.reviewStatus} />
        </Group>
      ))}
    </Flex>
  );
}
