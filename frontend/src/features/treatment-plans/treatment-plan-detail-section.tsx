'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { 
  Card, 
  Center, 
  Divider, 
  Group, 
  Loader, 
  Text, 
  Stack,
  Badge 
} from '@mantine/core';
import { IconCalendar, IconUser } from '@tabler/icons-react';

import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';
import ProcedureCard from '@/shared/components/procedure-card'; // Seu componente de card interno

export default function TreatmentPlanDetailSection() {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      {active !== null ? (
        <TreatmentPlanDetailContent treatmentPlanId={active} />
      ) : (
        <Center py="md" h="100%">
          <Text fw={600} size="lg" c="dimmed">
            Selecione um procedimento
          </Text>
        </Center>
      )}
    </Card>
  );
}

interface TreatmentPlanDetailContentProps {
  treatmentPlanId: string;
}

export function TreatmentPlanDetailContent({
  treatmentPlanId,
}: TreatmentPlanDetailContentProps) {
  const {
    data: treatmentPlan,
    isLoading,
    isError,
  } = useQuery({
    ...getTratmentPlanOptions(treatmentPlanId),
  });

  if (isLoading) {
    return (
      <Center py="md" h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py="md">
        <Text fw={600} size="lg" c="red">
          Plano de tratamento não encontrado.
        </Text>
      </Center>
    );
  }

  if (!treatmentPlan) {
    return (
      <Center py="md">
        <Text fw={600} size="lg" c="dimmed">
          Plano não encontrado.
        </Text>
      </Center>
    );
  }

  // Agora renderizamos os dados do plano com os procedimentos
  return (
    <>
      {/* Cabeçalho com informações do plano */}
      <Card.Section inheritPadding py="sm">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <Text fw={600} size="lg">
              {treatmentPlan.id || `Plano de Tratamento #${treatmentPlan.id}`}
            </Text>
            <Badge color={getStatusColor(treatmentPlan.status)}>
              {formatStatus(treatmentPlan.status)}
            </Badge>
          </Group>
          
          <Group gap="md">
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm" c="dimmed">
                Criado por {treatmentPlan.author.name}
              </Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={16} />
              <Text size="sm" c="dimmed">
                {new Date(treatmentPlan.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </Group>
          </Group>
        </Stack>
      </Card.Section>

      <Divider my="sm" />

      {/* Lista de procedimentos */}
      <Card.Section inheritPadding py="sm">
        <Stack gap="md">
          <Text fw={600} size="md">Procedimentos</Text>
          
          {treatmentPlan.procedures.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              Nenhum procedimento encontrado neste plano.
            </Text>
          ) : (
            <Stack gap="sm">
              {treatmentPlan.procedures.map((procedure) => (
                <ProcedureCard 
                  key={procedure.id} 
                  procedure={procedure}
                  // Passe outras props necessárias para o seu ProcedureCard
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Section>
    </>
  );
}

// Funções auxiliares (adicionar ao final do arquivo)
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'in_creation': 'blue',
    'in_progress': 'yellow',
    'done': 'green',
  };
  return statusColors[status] || 'gray';
}

function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    'in_creation': 'Em Criação',
    'in_progress': 'Em Andamento',
    'done': 'Concluído',
  };
  return statusLabels[status] || status;
}