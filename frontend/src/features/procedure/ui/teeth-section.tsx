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
import { IconDental, IconExclamationCircle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Mode, Procedure } from '@/shared/models';
import TeethMenu from './teeth-menu';

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
            Dentes/Regiões
          </Text>
          {showActionManu && (
            <TeethMenu
              procedureId={procedureId}
              queryOptions={queryOptions}
              currentTeeth={teeth}
            />
          )}
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
          Erro ao carregar dentes
        </Text>
      </Stack>
    );
  }

  if (!teeth) {
    return null;
  }

  if (teeth.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhuma opção selecionada
      </Text>
    );
  }

  return (
    <Flex gap="xs" wrap="wrap" justify="center">
      {teeth.map((tooth) => (
        <Badge size="lg" variant="light" key={tooth}>
          <Flex align="center" wrap="nowrap" gap="4px">
            <IconDental size={16} />
            <Text size="sm" fw="500" style={{ marginTop: '0.125rem' }}>
              {tooth}
            </Text>
          </Flex>
        </Badge>
      ))}
    </Flex>
  );
}
