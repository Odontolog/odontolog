'use client';

import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconArrowRight, IconCalendar, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import CardInfo from '@/shared/components/card-info';
import { StatusBadge } from '@/shared/components/status';
import { getProcedureOptions } from '../procedure/requests';
import DetailSection from '../procedure/ui/detail-section';
import AttachmentsSection from '../procedure/ui/attachements/atts-section';

export default function ProcedureDetailSection({
  scrollAreaHeight,
}: {
  scrollAreaHeight?: string;
}) {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
      {active !== null ? (
        <ProcedureDetailContent
          procedureId={active}
          scrollAreaHeight={scrollAreaHeight}
        />
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

interface ProcedureContentProps {
  procedureId: string;
  scrollAreaHeight?: string;
}

export function ProcedureDetailContent({
  procedureId,
  scrollAreaHeight = '610px',
}: ProcedureContentProps) {
  const queryOptions = getProcedureOptions(procedureId);
  const {
    data: procedure,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    enabled: !!procedureId,
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
        <Text fw={500} size="lg" c="red">
          Procedimento não encontrado.
        </Text>
      </Center>
    );
  }

  if (!procedure) {
    return (
      <Center py="md">
        <Text fw={500} size="lg" c="dimmed">
          Procedimento não encontrado.
        </Text>
      </Center>
    );
  }

  return (
    <Box h="100%">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg">
            {procedure.name}{' '}
            <Text span c="dimmed">
              #{procedure.id}
            </Text>
          </Text>
          <StatusBadge status={procedure.status} />
        </Group>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="sm" h="100%">
        <ScrollArea
          scrollbarSize={6}
          offsetScrollbars
          scrollbars="y"
          w="100%"
          h={scrollAreaHeight}
        >
          <Stack gap="md" flex="1">
            <Group gap="md">
              <CardInfo icon={IconUser} text={procedure.author.name} />
              <CardInfo
                icon={IconCalendar}
                text={
                  <Tooltip
                    label={format(procedure.createdAt, 'dd/MM/yyyy HH:mm')}
                    withArrow
                    transitionProps={{ duration: 200 }}
                  >
                    <span>
                      {formatDistanceToNow(procedure.createdAt, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </Tooltip>
                }
              />
            </Group>
            <DetailSection
              mode="read"
              queryOptions={queryOptions}
              reviewableId={procedureId}
            />
            <AttachmentsSection
              mode="read"
              queryOptions={queryOptions}
              reviewableId={procedureId}
            />
          </Stack>

          <Flex justify="end" py="lg">
            <Button
              variant="outline"
              component={Link}
              href={`/patients/${procedure.patient.id}/procedures/${procedure.id}`}
              color="blue"
              rightSection={<IconArrowRight size={16} />}
              size="xs"
            >
              Ver completo
            </Button>
          </Flex>
        </ScrollArea>
      </Card.Section>
    </Box>
  );
}
