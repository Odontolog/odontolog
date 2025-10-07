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
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Mode, Procedure, User } from '@/shared/models';

interface TeethSectionProps {
  procedureId: string;
  mode: Mode;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
}

export default function TeethSection({
  procedureId,
  queryOptions,
  mode,
}: TeethSectionProps) {
  const {
    data: teeth,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.teeth,
  });

  const showActionManu =
    mode === 'edit' && teeth !== undefined && !isError && !isLoading;

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Encarregado
          </Text>
          {/* {showActionManu && (
            <AssigneeMenu
              reviewableId={reviewableId}
              queryOptions={queryOptions}
              currentAssignee={assignee}
            />
          )} */}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <TeethSectionContent
          teeth={teeth}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface TeethSectionContentProps {
  teeth?: string[];
  isLoading: boolean;
  isError: boolean;
}

function TeethSectionContent(props: TeethSectionContentProps) {
  const { teeth, isLoading, isError } = props;

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

  if (!teeth) {
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
