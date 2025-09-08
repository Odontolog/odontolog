'use client';

import { useState } from 'react';
import {
  Text,
  Checkbox,
  Button,
  Stack,
  Loader,
  ScrollArea,
  Menu,
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Supervisor } from '../models';
import { getAvailableSupervisors, saveSupervisors } from '../requests';

interface SupervisorMenuProps {
  procedureId: string;
  currentSupervisors: Supervisor[];
  setMenuOpened: (value: boolean) => void;
}

export default function SupervisorMenu({
  procedureId,
  currentSupervisors,
  setMenuOpened,
}: SupervisorMenuProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['availableSupervisors'],
    queryFn: getAvailableSupervisors,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentSupervisors.map((s) => s.id),
  );

  const mutation = useMutation({
    mutationFn: (supervisors: string[]) =>
      saveSupervisors(procedureId, supervisors),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['procedureSupervisors', procedureId],
      });
      setMenuOpened(false);
    },
  });

  if (isLoading) {
    return (
      <Stack p="xs" gap="sm" w={180} align="center">
        <Loader size="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="xs">
          Selecione supervisores
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={180}>
        <ScrollArea h={150} scrollbars="y">
          <Stack p="none" gap="xs">
            {data?.map((sup) => (
              <Checkbox
                key={sup.id}
                label={sup.name}
                checked={selectedIds.includes(sup.id)}
                onChange={(e) => {
                  const newSelectedIds = e.currentTarget.checked
                    ? [...selectedIds, sup.id]
                    : selectedIds.filter((id) => id !== sup.id);
                  setSelectedIds(newSelectedIds);
                }}
              />
            ))}
          </Stack>
        </ScrollArea>
        <Button
          size="xs"
          onClick={() => mutation.mutate(selectedIds)}
          loading={mutation.isPending}
        >
          Salvar
        </Button>
        {mutation.isError && 'DEU RUIM'}
      </Stack>
    </>
  );
}
