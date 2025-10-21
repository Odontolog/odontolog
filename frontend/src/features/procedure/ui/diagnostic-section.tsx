'use client';

import {
  ActionIcon,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Text,
  Textarea,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ProcedureSectionProps } from '@/features/procedure/models';
import { saveDiagnostic } from '@/features/procedure/requests';

export default function DiagnosticSection({
  procedureId,
  queryOptions,
  mode,
}: ProcedureSectionProps) {
  const [editing, setEditing] = useState(false);

  const {
    data: diagnostic,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.procedureDetail.diagnostic,
    enabled: false,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Diagnóstico
          </Text>
          {mode === 'edit' && !editing && (
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={isLoading || isError}
              onClick={() => setEditing(true)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        <DiagnosticSectionContent
          procedureId={procedureId}
          diagnostic={diagnostic}
          isLoading={isLoading}
          isError={isError}
          editing={editing}
          setEditing={setEditing}
          queryOptions={queryOptions}
          mode={mode}
        />
      </Card.Section>
    </Card>
  );
}

interface DiagnosticSectionContentProps extends ProcedureSectionProps {
  diagnostic?: string;
  isLoading: boolean;
  isError: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
}

function DiagnosticSectionContent({
  procedureId,
  diagnostic,
  isLoading,
  isError,
  editing,
  setEditing,
  queryOptions,
}: DiagnosticSectionContentProps) {
  const queryClient = useQueryClient();

  // NOTE: This is necessary to make reactive UI changes and keep the useState
  //       in sync with the query. Ref: https://tkdodo.eu/blog/deriving-client-state-from-server-state
  const [value, setValue] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (value: string) => saveDiagnostic(procedureId, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setValue(null);
      setEditing(false);
    },
    onError: (error) => {
      notifications.show({
        title: 'Não foi possível salvar os dados',
        message: `Um erro inesperado aconteceu e não foi possível salvar suas alterações nos detalhes. Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

  function handleCancel() {
    setValue(null);
    setEditing(false);
    mutation.reset();
  }

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center>
        <Flex align="center" gap="xs">
          <ThemeIcon variant="white" color="red">
            <IconExclamationCircle size={24} />
          </ThemeIcon>
          <Text size="sm" c="red" py="none">
            Erro ao carregar observações
          </Text>
        </Flex>
      </Center>
    );
  }

  if (diagnostic === undefined) {
    return null;
  }

  const displayValue = editing
    ? value === null
      ? diagnostic
      : value
    : diagnostic;

  return (
    <>
      <Flex direction="column" gap="sm">
        {!editing ? (
          <Text
            size="sm"
            c={displayValue ? 'black' : 'dimmed'}
            style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
          >
            {displayValue || 'Nenhum valor definido'}
          </Text>
        ) : (
          <Textarea
            value={displayValue ?? ''}
            onChange={(e) => setValue(e.currentTarget.value)}
            autosize
            minRows={2}
          />
        )}
      </Flex>
      {editing && (
        <Flex
          justify="space-between"
          align="center"
          direction="row-reverse"
          mt="sm"
        >
          <Group gap="xs">
            <Button variant="default" fw="normal" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => mutation.mutate(displayValue)}
              loading={mutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </>
  );
}
