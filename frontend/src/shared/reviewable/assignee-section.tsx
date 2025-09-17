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
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Reviewable } from '@/shared/models';
import AssigneeMenu from './assignee-menu';

interface AssigneeSectionProps<T extends Reviewable> {
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export default function AssigneeSection<T extends Reviewable>({
  queryOptions,
}: AssigneeSectionProps<T>) {
  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    select: (data) => ({
      assignee: data.assignee,
      id: data.id,
    }),
  });

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding px="sm" py="xs">
        <Group justify="space-between">
          <Text fw={600} size="md">
            Aluno
          </Text>
          {data?.assignee && (
            <AssigneeMenu
              queryOptions={queryOptions}
              reviewableId={data.id}
              currentAssignee={data.assignee}
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
              Erro ao carregar Alunos
            </Text>
          </Flex>
        )}

        <Flex gap="xs" direction="column">
          {data?.assignee && (
            <Group key={data.assignee.id} gap="xs">
              <Avatar
                src={data.assignee.avatarUrl}
                size="sm"
                variant="filled"
              />
              <Text size="sm">{data.assignee.name}</Text>
              {data.assignee.role === 'student' && (
                <Text size="xs" c="dimmed">
                  Matrícula: {(data.assignee as any).enrollment}
                </Text>
              )}
            </Group>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
}
