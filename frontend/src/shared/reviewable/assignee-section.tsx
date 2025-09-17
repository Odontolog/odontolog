'use client';

import {
  Card,
  Text,
  Group,
  Avatar,
  Loader,
  Center,
  Flex,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Reviewable } from '@/shared/models';
import AssigneeMenu from './assignee-menu';

interface AssigneeSectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export default function AssigneeSection<T extends Reviewable>({
  reviewableId,
  queryOptions,
}: AssigneeSectionProps<T>) {
  const {
    data: assignee,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.assignee,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Encarregado
          </Text>
          {assignee && (
            <AssigneeMenu
              reviewableId={reviewableId}
              queryOptions={queryOptions}
              currentAssignee={assignee}
            />
          )}
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
              Erro ao carregar Alunos
            </Text>
          </Flex>
        )}

        <Flex gap="xs" direction="column">
          {assignee && (
            <Group key={assignee.id} gap="xs">
              <Avatar src={assignee.avatarUrl} size="sm" variant="filled" />
              <Text size="sm">{assignee.name}</Text>
            </Group>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
}
