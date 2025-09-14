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
  ActionIcon,
} from '@mantine/core';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { IconEdit } from '@tabler/icons-react';

import { HasReviewable, Review } from '@/shared/models';
import { getAvailableSupervisors, saveSupervisors } from './requests';

interface SupervisorMenuProps {
  reviewableId: string;
  queryOptions: UseQueryOptions<HasReviewable, Error, HasReviewable, string[]>;
  currentReviews: Review[];
}

export default function SupervisorMenu(props: SupervisorMenuProps) {
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

interface SupervisorMenuContentProps extends SupervisorMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function SupervisorMenuContent({
  reviewableId,
  queryOptions,
  currentReviews,
  setMenuOpened,
}: SupervisorMenuContentProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['availableSupervisors'],
    queryFn: getAvailableSupervisors,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentReviews.map((s) => s.supervisor.id),
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
      <Stack p="xs" gap="sm" w={180} align="center">
        <Loader size="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Selecione supervisores
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={180}>
        <ScrollArea.Autosize mah={150} scrollbars="y">
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
