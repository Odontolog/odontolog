'use client';

import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Menu,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import { Reviewable } from '@/shared/models';
import { SupervisorReviewStatus } from './models';
import { getAvailableSupervisors, saveSupervisors } from './requests';

const MENU_WIDTH = 260;

interface SupervisorMenuProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
  supervisors: SupervisorReviewStatus[];
}

export default function SupervisorMenu<T extends Reviewable>(
  props: SupervisorMenuProps<T>,
) {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  return (
    <Menu
      withinPortal
      position="bottom"
      shadow="sm"
      opened={menuOpened}
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconEdit size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <SupervisorMenuContent {...props} setMenuOpened={setMenuOpened} />
      </Menu.Dropdown>
    </Menu>
  );
}

interface SupervisorMenuContentProps<T extends Reviewable>
  extends SupervisorMenuProps<T> {
  setMenuOpened: (value: boolean) => void;
}

function SupervisorMenuContent<T extends Reviewable>({
  reviewableId,
  queryOptions,
  supervisors,
  setMenuOpened,
}: SupervisorMenuContentProps<T>) {
  const queryClient = useQueryClient();

  const {
    data: availableSupervisors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['availableSupervisors'],
    queryFn: getAvailableSupervisors,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(
    supervisors.map((s) => s.id),
  );

  const mutation = useMutation({
    mutationFn: (supervisors: string[]) =>
      saveSupervisors(reviewableId, supervisors),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
    },
  });

  if (isLoading) {
    return (
      <Center w={MENU_WIDTH} h={100}>
        <Stack p="xs" gap="sm" w={180} align="center">
          <Loader size="sm" />
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center w={MENU_WIDTH} h={100}>
        <Stack align="center" gap="0">
          <ThemeIcon variant="white" color="red">
            <IconExclamationCircle size={24} />
          </ThemeIcon>
          <Text size="sm" c="red" py="none" ta="center">
            Erro ao carregar supervisores
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!availableSupervisors) {
    return null;
  }

  if (availableSupervisors.length === 0) {
    return (
      <Center w={MENU_WIDTH} h={100}>
        <Text size="sm" c="dimmed" ta="center">
          Não há supervisores disponíveis
        </Text>
      </Center>
    );
  }

  const options = availableSupervisors.map((sup) => (
    <Checkbox.Card key={sup.id} value={sup.id} withBorder={false}>
      <Group wrap="nowrap" align="center" gap="xs">
        <Checkbox.Indicator size="sm" />
        <Box>
          <Text size="sm">{sup.name}</Text>
          <Text size="xs" c="dimmed">
            {sup.specialization}
          </Text>
        </Box>
      </Group>
    </Checkbox.Card>
  ));

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Selecione supervisores para revisão
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={MENU_WIDTH}>
        <ScrollArea.Autosize mah={150} scrollbars="y">
          <Checkbox.Group
            p="none"
            value={selectedIds}
            onChange={setSelectedIds}
          >
            <Stack p="none" gap="xs">
              {options}
            </Stack>
          </Checkbox.Group>
        </ScrollArea.Autosize>
        <Button
          size="xs"
          onClick={() => mutation.mutate(selectedIds)}
          loading={mutation.isPending}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
