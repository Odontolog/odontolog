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
import { Student, Supervisor, HasReviewable } from '@/shared/models';
import { getAvailableStudents, saveStudent } from '../reviewable/requests';
import { IconEdit } from '@tabler/icons-react';

interface AssigneeMenuProps {
  queryOptions: UseQueryOptions<HasReviewable, Error, HasReviewable, string[]>;
  reviewableId: string;
  currentAssignee: Student | Supervisor;
}

export default function AssigneeMenu({
  queryOptions,
  reviewableId,
  currentAssignee,
}: AssigneeMenuProps) {
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
          queryOptions={queryOptions}
          reviewableId={reviewableId}
          currentAssignee={currentAssignee}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface AssigneeMenuContentProps extends AssigneeMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function AssigneeMenuContent({
  queryOptions,
  reviewableId,
  currentAssignee,
  setMenuOpened,
}: AssigneeMenuContentProps) {
  const queryClient = useQueryClient();

  // Busca os estudantes disponíveis
  const { data: students, isLoading } = useQuery({
    queryKey: ['availableStudents'],
    queryFn: getAvailableStudents,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    currentAssignee?.role === 'student' ? (currentAssignee as Student) : null,
  );

  const mutation = useMutation({
    mutationFn: (assigneeId: string) => saveStudent(reviewableId, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
    },
  });

  const filteredStudents = (Array.isArray(students) ? students : []).filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const options = filteredStudents.map((student) => (
    <Combobox.Option value={student.id} key={student.id}>
      {student.name}
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
          Atribuir aluno
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm" w={250}>
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(studentId) => {
            const student = (Array.isArray(students) ? students : []).find(
              (s) => s.id === studentId,
            );
            setSelectedStudent(student || null);
            setSearch(student?.name || '');
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
                setSearch(selectedStudent?.name || '');
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
            if (selectedStudent) {
              mutation.mutate(selectedStudent.id);
            }
          }}
          loading={mutation.isPending}
          disabled={!selectedStudent}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
