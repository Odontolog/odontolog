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
import { HasReviewable } from '@/shared/models';
// import AssigneeMenu from './assignee-menu';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

interface AssigneeSectionProps {
  queryOptions: UseQueryOptions<HasReviewable, Error, HasReviewable, string[]>;
}

export default function AssigneeSection({
  queryOptions,
}: AssigneeSectionProps) {
  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    select: (data) => ({
      assignee: data.reviewable.assignee,
      reviewableId: data.reviewableId,
    }),
  });

  return (
    <Card withBorder shadow="sm" radius="md" w={220}>
      <Card.Section withBorder inheritPadding px="sm" py="xs">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            Aluno
          </Text>
          {/* {data?.assignee && (
            // <AssigneeMenu
            //   procedureId={procedureId}
            //   currentAssignee={data.assignee}
            // />
          )} */}
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
                size="xs"
                variant="filled"
              />
              <Text size="xs">{data.assignee.name}</Text>
            </Group>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
}
