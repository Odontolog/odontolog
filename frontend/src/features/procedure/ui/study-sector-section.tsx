'use client';

import {
  Badge,
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

import { Mode, Procedure } from '@/shared/models';
import StudySectorMenu from './study-sector-menu';

interface StudySectorSectionProps {
  procedureId: string;
  mode: Mode;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
}

export default function StudySectorSection({
  procedureId,
  queryOptions,
  mode,
}: StudySectorSectionProps) {
  const {
    data: studySector,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.studySector,
  });

  const showActionManu =
    mode === 'edit' && studySector !== undefined && !isError && !isLoading;

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Seção de estudo
          </Text>
          {showActionManu && (
            <StudySectorMenu
              procedureId={procedureId}
              queryOptions={queryOptions}
              currentStudySector={studySector}
            />
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <StudySectorSectionContent
          studySector={studySector}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface StudySectorSectionContentProps {
  studySector?: string;
  isLoading: boolean;
  isError: boolean;
}

function StudySectorSectionContent(props: StudySectorSectionContentProps) {
  const { studySector, isLoading, isError } = props;

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
          Erro ao carregar seção de estudo
        </Text>
      </Stack>
    );
  }

  if (studySector === undefined) {
    return null;
  }

  if (studySector === '' || studySector === null) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhuma área de estudo selecionada
      </Text>
    );
  }

  return (
    <Flex gap="xs" wrap="wrap" justify="center">
      <Badge size="lg" variant="light">
        <Text size="sm" fw="500" style={{ marginTop: '0.125rem' }}>
          {studySector}
        </Text>
      </Badge>
    </Flex>
  );
}
