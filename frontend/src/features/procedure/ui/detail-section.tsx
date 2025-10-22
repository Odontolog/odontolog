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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Procedure, ProcedureDetail } from '@/shared/models';
import { ReviewableSectionProps } from '@/shared/reviewable/models';
import { saveDetails } from '../requests';

const LABELS: Record<string, string> = {
  diagnostic: 'Diagnóstico',
};

export default function DetailSection<T extends Procedure>({
  reviewableId,
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const [editing, setEditing] = useState(false);
  const { data: details, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => data.procedureDetail,
    enabled: false,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Detalhes
          </Text>
          {mode === 'edit' && !editing && (
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
        {isLoading || !details ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <DetailSectionContent
            details={details}
            editing={editing}
            setEditing={setEditing}
            procedureId={reviewableId}
          />
        )}
      </Card.Section>
    </Card>
  );
}

interface DetailSectionContentProps {
  details: ProcedureDetail;
  editing: boolean;
  setEditing: (value: boolean) => void;
  procedureId: string;
}

function DetailSectionContent({
  details,
  editing,
  setEditing,
  procedureId,
}: DetailSectionContentProps) {
  const queryClient = useQueryClient();

  // NOTE: This is necessary to make reactive UI changes and keep the useState
  //       in sync with the query.
  const [values, setValues] = useState({});
  const displayValues = editing ? { ...details, ...values } : details;

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const mutation = useMutation({
    mutationFn: (values: ProcedureDetail) => saveDetails(procedureId, values),
    onSuccess: async (details) => {
      await queryClient.setQueryData(
        ['procedure', procedureId, 'details'],
        details,
      );
      setValues({});
      setEditing(false);
    },
    onError(error) {
      notifications.show({
        title: 'Não foi possível salvar os dados',
        message: `Um erro inesperado aconteceu e não foi possível salvar suas alterações nos detalhes. Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

  function handleSave() {
    mutation.mutate(displayValues);
  }

  function handleCancel() {
    setValues(details);
    setEditing(false);
    mutation.reset();
  }

  return (
    <>
      <Flex direction="column" gap="sm">
        {Object.entries(displayValues).map(([key, value]) => (
          <div key={key}>
            <Text size="sm" fw={600}>
              {LABELS[key]}
            </Text>
            {!editing ? (
              <Text
                size="sm"
                c={value ? 'black' : 'dimmed'}
                style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
              >
                {value || 'Nenhum valor definido'}
              </Text>
            ) : (
              <Textarea
                value={value}
                onChange={(e) => handleChange(key, e.currentTarget.value)}
                autosize
                minRows={2}
              />
            )}
          </div>
        ))}
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
