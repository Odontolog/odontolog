'use client';

import {
  ActionIcon,
  Avatar,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconExclamationCircle, IconTrash } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import { Student } from '@/shared/models';
import { getAllowedStudentsOptions, removePermission } from '../requests';
import PermissionMenu from './permission-menu';

interface PemissionSectionProps {
  patientId: string;
}

export default function PermissionSection({
  patientId,
}: PemissionSectionProps) {
  const options = getAllowedStudentsOptions(patientId);

  const { data: allowedStudents, isError, isLoading } = useQuery(options);

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Permissões
          </Text>
          {allowedStudents && (
            <PermissionMenu
              patientId={patientId}
              queryOptions={options}
              currentAllowedStudents={allowedStudents}
            />
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <PermissionSectionContent
          patientId={patientId}
          allowedStudents={allowedStudents}
          options={options}
          isError={isError}
          isLoading={isLoading}
        />
      </Card.Section>
    </Card>
  );
}

interface PemissionSectionContentProps {
  patientId: string;
  allowedStudents?: Student[];
  options: UseQueryOptions<Student[], Error, Student[], string[]>;
  isError: boolean;
  isLoading: boolean;
}

function PermissionSectionContent(props: PemissionSectionContentProps) {
  const { patientId, allowedStudents, options, isError, isLoading } = props;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (studentId: string) => removePermission(patientId, studentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: options.queryKey });
    },
  });

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Flex align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar alunos
        </Text>
      </Flex>
    );
  }

  if (!allowedStudents) {
    return null;
  }

  if (allowedStudents.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhum aluno tem permissão
      </Text>
    );
  }

  return (
    <Grid>
      {allowedStudents.map((student) => (
        <Grid.Col span={{ md: 12, lg: 6 }} key={student.id}>
          <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Group wrap="nowrap" w="100%">
              <Center>
                <Avatar
                  src={student.avatarUrl}
                  name={student.name}
                  color="initials"
                />
              </Center>

              <div style={{ flex: 1 }}>
                <Text>{student.name}</Text>

                <Text c="dimmed" size="xs">
                  Clínica {student.clinic} •{' '}
                  <Text span fw={700}>
                    {student.enrollment}
                  </Text>
                </Text>
              </div>

              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => mutation.mutate(student.id)}
                disabled={mutation.isPending}
                loading={mutation.isPending}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}
