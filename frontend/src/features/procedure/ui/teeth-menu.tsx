'use client';

import { useState } from 'react';
import {
  Text,
  Button,
  Stack,
  Menu,
  ActionIcon,
  MultiSelect,
} from '@mantine/core';
import {
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { IconEdit } from '@tabler/icons-react';

import { Procedure } from '@/shared/models';
import { teeth } from '@/shared/data';
import { saveTeeth } from '../requests';

interface TeethMenuProps {
  procedureId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  currentTeeth: string[];
}

export default function TeethMenu({
  procedureId,
  queryOptions,
  currentTeeth,
}: TeethMenuProps) {
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
        <TeethMenuContent
          procedureId={procedureId}
          queryOptions={queryOptions}
          currentTeeth={currentTeeth}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface TeethMenuContentProps extends TeethMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function TeethMenuContent({
  procedureId,
  queryOptions,
  currentTeeth,
  setMenuOpened,
}: TeethMenuContentProps) {
  const queryClient = useQueryClient();

  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([
    ...currentTeeth,
  ]);

  const mutation = useMutation({
    mutationFn: (teeth: string[]) => saveTeeth(procedureId, teeth),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
    },
  });

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Selecione o encarregado
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={400}>
        <MultiSelect
          label="Selecione o(s) dente(s) ou região(ões) relacionadas"
          placeholder="Selecione uma opção"
          required
          data={teeth}
          value={selectedTeeth}
          onChange={(value) => setSelectedTeeth(value)}
          comboboxProps={{ withinPortal: false }}
        />

        <Button
          size="xs"
          onClick={() => mutation.mutate(selectedTeeth)}
          loading={mutation.isPending}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
