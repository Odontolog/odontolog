'use client';

import {
  Avatar,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Reviewable, User } from '@/shared/models';
import AssigneeMenu from './assignee-menu';
import { ReviewableSectionProps } from './models';

export default function AssigneeSection<T extends Reviewable>({
  reviewableId,
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const {
    data: assignee,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.assignee,
  });

  const showActionManu =
    mode === 'edit' && assignee !== undefined && !isError && !isLoading;

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Encarregado
          </Text>
          {showActionManu && (
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
        <AssigneeSectionContent
          assignee={assignee}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface AssigneeSectionContentProps {
  assignee?: User;
  isLoading: boolean;
  isError: boolean;
}

function AssigneeSectionContent(props: AssigneeSectionContentProps) {
  const { assignee, isLoading, isError } = props;

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
          Erro ao carregar Encarregado
        </Text>
      </Stack>
    );
  }

  if (!assignee) {
    return null;
  }

  return (
    <Flex gap="xs" direction="column">
      <Group key={assignee.id} gap="xs">
        <Avatar src={assignee.avatarUrl} size="sm" variant="filled" />
        <Text size="sm">{assignee.name}</Text>
      </Group>
    </Flex>
  );
}
