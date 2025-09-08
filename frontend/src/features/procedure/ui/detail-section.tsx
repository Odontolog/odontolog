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
} from '@mantine/core';
import { ProcedureDetail } from '../models';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDetails, saveDetails } from '../requests';

const LABELS: Record<string, string> = {
  diagnostic: 'Diagnóstico',
  notes: 'Observações',
};

interface DetailSectionProps {
  procedureId: string;
}

export default function DetailSection({ procedureId }: DetailSectionProps) {
  const [editing, setEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['procedureDetails', procedureId],
    queryFn: () => getDetails(procedureId),
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Detalhes
          </Text>
          {!editing && (
            <Button
              size="xs"
              variant="default"
              onClick={() => setEditing(true)}
              disabled={isLoading}
            >
              Editar
            </Button>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        {isLoading || !data ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <DetailSectionContent
            data={data}
            editing={editing}
            setEditing={setEditing}
            procedureId={procedureId}
          />
        )}
      </Card.Section>
    </Card>
  );
}

interface DetailSectionContentProps {
  data: ProcedureDetail;
  editing: boolean;
  setEditing: (value: boolean) => void;
  procedureId: string;
}

function DetailSectionContent({
  data,
  editing,
  setEditing,
  procedureId,
}: DetailSectionContentProps) {
  const originalData = { ...data };

  const [values, setValues] = useState<ProcedureDetail>(data);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const mutation = useMutation({
    mutationFn: (values: ProcedureDetail) => saveDetails(procedureId, values),
    onSuccess: () => {
      setEditing(false);
    },
  });

  async function handleSave() {
    await mutation.mutateAsync(values);
  }

  function handleCancel() {
    setValues(originalData);
    setEditing(false);
    mutation.reset();
  }

  return (
    <>
      {Object.entries(values).map(([key, value]) => (
        <div key={key}>
          <Text size="sm" fw={500}>
            {LABELS[key]}
          </Text>
          {!editing ? (
            <Text size="sm" c={value ? 'black' : 'dimmed'}>
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
      {editing && (
        <Flex justify="space-between" align="center" direction="row-reverse">
          <Group mt="sm">
            <Button variant="default" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={mutation.isPending}>
              Salvar
            </Button>
          </Group>
          {mutation.isError && (
            <Text c="red" size="sm">
              Erro ao salvar dados. Tente novamente mais tarde.
            </Text>
          )}
        </Flex>
      )}
    </>
  );
}
