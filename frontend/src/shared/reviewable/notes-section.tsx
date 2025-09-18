'use client';

import { useState } from 'react';
import {
  Text,
  Textarea,
  Button,
  Group,
  Card,
  Divider,
  Center,
  Loader,
  Flex,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';

import { saveDetails } from './requests';
import { Reviewable } from '../models';

interface NotesSectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export default function NotesSection<T extends Reviewable>({
  reviewableId,
  queryOptions,
}: NotesSectionProps<T>) {
  const [editing, setEditing] = useState(false);

  const { data: notes, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => data.notes,
    enabled: false,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Observações
          </Text>
          {!editing && (
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={isLoading}
              onClick={() => setEditing(true)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        {isLoading || !notes ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <DetailSectionContent
            reviewableId={reviewableId}
            notes={notes}
            editing={editing}
            setEditing={setEditing}
            queryOptions={queryOptions}
          />
        )}
      </Card.Section>
    </Card>
  );
}

interface DetailSectionContentProps<T extends Reviewable>
  extends NotesSectionProps<T> {
  reviewableId: string;
  notes: string;
  editing: boolean;
  setEditing: (value: boolean) => void;
}

function DetailSectionContent<T extends Reviewable>({
  reviewableId,
  notes,
  editing,
  setEditing,
  queryOptions,
}: DetailSectionContentProps<T>) {
  const queryClient = useQueryClient();

  // NOTE: This is necessary to make reactive UI changes and keep the useState
  //       in sync with the query. Ref: https://tkdodo.eu/blog/deriving-client-state-from-server-state
  const [value, setValue] = useState('');
  const displayValue = editing ? value || notes : notes;

  const mutation = useMutation({
    mutationFn: (value: string) => saveDetails(reviewableId, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setValue('');
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

  async function handleSave() {
    await mutation.mutateAsync(displayValue);
  }

  function handleCancel() {
    setValue(notes);
    setEditing(false);
    mutation.reset();
  }

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
            value={displayValue}
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
            <Button onClick={handleSave} loading={mutation.isPending}>
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </>
  );
}
