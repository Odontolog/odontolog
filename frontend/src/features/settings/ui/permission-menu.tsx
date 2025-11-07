'use client';

import {
  ActionIcon,
  Button,
  Center,
  Loader,
  Menu,
  Select,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconExclamationCircle, IconPlus } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import { Student } from '@/shared/models';
import { getAvailableUsers } from '@/shared/reviewable/requests';
import { grantPermission } from '../requests';

const MENU_WIDTH = 400;

interface PermissionMenuProps {
  patientId: string;
  queryOptions: UseQueryOptions<Student[], Error, Student[], string[]>;
  currentAllowedStudents: Student[];
}

export default function PermissionMenu({
  patientId,
  queryOptions,
  currentAllowedStudents,
}: PermissionMenuProps) {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  return (
    <Menu
      withinPortal
      position="bottom"
      floatingStrategy="fixed"
      shadow="sm"
      opened={menuOpened}
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconPlus size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <StudySectorMenuContent
          patientId={patientId}
          queryOptions={queryOptions}
          currentAllowedStudents={currentAllowedStudents}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface PermissionMenuContentProps extends PermissionMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function StudySectorMenuContent({
  patientId,
  queryOptions,
  currentAllowedStudents,
  setMenuOpened,
}: PermissionMenuContentProps) {
  const queryClient = useQueryClient();

  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['availableUsers'],
    queryFn: getAvailableUsers,
  });

  const studentData = students
    ? students.map((students) => ({ value: students.id, label: students.name }))
    : [];
  const currentAllowedStudentIds = currentAllowedStudents.map(
    (student) => student.id,
  );
  const studentDataFiltered = studentData.filter(
    (student) => !currentAllowedStudentIds.includes(student.value),
  );

  const [selected, setSelected] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (studentId: string) => grantPermission(patientId, studentId),
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
            Erro ao carregar alunos
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Configure quais alunos podem ter acesso a este prontuário
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={400}>
        <Select
          label="Selecione um aluno"
          placeholder="Selecione uma opção"
          data={studentDataFiltered}
          searchable
          nothingFoundMessage="Nenhuma aluno disponível..."
          value={selected}
          onChange={(value) => setSelected(value)}
          comboboxProps={{ withinPortal: false }}
        />

        <Button
          size="xs"
          onClick={() => selected !== null && mutation.mutate(selected)}
          loading={mutation.isPending}
          disabled={mutation.isPending || selected === null}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
