'use client';

import { useState } from 'react';
import {
  Text,
  Button,
  Stack,
  Loader,
  Menu,
  ActionIcon,
  Combobox,
  InputBase,
  useCombobox,
} from '@mantine/core';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { IconEdit } from '@tabler/icons-react';

import { Reviewable, User } from '@/shared/models';
import { getAvailableUsers, saveAssignee } from '@/shared/reviewable/requests';

interface AssigneeMenuProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
  currentAssignee: User;
}

export default function AssigneeMenu<T extends Reviewable>({
  reviewableId,
  queryOptions,
  currentAssignee,
}: AssigneeMenuProps<T>) {
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
        <AssigneeMenuContent
          reviewableId={reviewableId}
          queryOptions={queryOptions}
          currentAssignee={currentAssignee}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface AssigneeMenuContentProps<T extends Reviewable>
  extends AssigneeMenuProps<T> {
  setMenuOpened: (value: boolean) => void;
}

function AssigneeMenuContent<T extends Reviewable>({
  reviewableId,
  queryOptions,
  currentAssignee,
  setMenuOpened,
}: AssigneeMenuContentProps<T>) {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['availableUsers'],
    queryFn: getAvailableUsers,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const mutation = useMutation({
    mutationFn: (assigneeId: string) => saveAssignee(reviewableId, assigneeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
    },
  });

  const baseUsers = users
    ? users.filter(
        (user) =>
          !user.name
            .toLocaleLowerCase()
            .includes(currentAssignee.name.toLocaleLowerCase()),
      )
    : [];

  const filteredUsers = baseUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const options = filteredUsers.map((user) => (
    <Combobox.Option value={user.id} key={user.id}>
      {user.name}
    </Combobox.Option>
  ));

  if (isLoading) {
    return (
      <Stack p="xs" gap="sm" w={250} align="center">
        <Loader size="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Selecione o encarregado
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={250}>
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(userId) => {
            const user = baseUsers.find((u) => u.id === userId);
            setSearch(user?.name ?? '');

            if (user) {
              setSelectedUser(user);
            }

            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              rightSection={<Combobox.Chevron />}
              value={search}
              onChange={(event) => {
                combobox.openDropdown();
                combobox.updateSelectedOptionIndex();
                setSearch(event.currentTarget.value);
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => {
                combobox.closeDropdown();
                setSearch(selectedUser?.name ?? '');
              }}
              placeholder="Buscar aluno..."
              rightSectionPointerEvents="none"
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>Nenhum aluno encontrado</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Button
          size="xs"
          onClick={() => {
            if (selectedUser) {
              mutation.mutate(selectedUser.id);
            }
          }}
          loading={mutation.isPending}
          disabled={!selectedUser}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
