'use client';

import { ActionIcon, Button, Menu, Select, Stack, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import {
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import { studySectors } from '@/shared/data';
import { Procedure } from '@/shared/models';
import { saveStudySector } from '../requests';

interface StudySectorMenuProps {
  procedureId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  currentStudySector: string;
}

export default function StudySectorMenu({
  procedureId,
  queryOptions,
  currentStudySector,
}: StudySectorMenuProps) {
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
        <StudySectorMenuContent
          procedureId={procedureId}
          queryOptions={queryOptions}
          currentStudySector={currentStudySector}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface StudySectorMenuContentProps extends StudySectorMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function StudySectorMenuContent({
  procedureId,
  queryOptions,
  currentStudySector,
  setMenuOpened,
}: StudySectorMenuContentProps) {
  const queryClient = useQueryClient();

  const [selectedStudySector, setSelectedStudySector] = useState<string | null>(
    currentStudySector,
  );

  const mutation = useMutation({
    mutationFn: (studySector: string) =>
      saveStudySector(procedureId, studySector),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
    },
  });

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Selecione uma Seção de Estudo
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={400}>
        <Select
          label="Seção de estudo"
          placeholder="Selecione uma opção"
          data={studySectors}
          searchable
          nothingFoundMessage="Nenhuma seção de estudo encontrada..."
          value={selectedStudySector}
          onChange={(value) => setSelectedStudySector(value)}
          comboboxProps={{ withinPortal: false }}
        />

        <Button
          size="xs"
          onClick={() => mutation.mutate(selectedStudySector ?? '')}
          loading={mutation.isPending}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
