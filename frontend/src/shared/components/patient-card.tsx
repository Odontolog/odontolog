'use client';

import { Avatar, Card, Center, Group, Text } from '@mantine/core';
import Link from 'next/link';

import { PatientAndTreatmentPlan } from '@/shared/models';
import styles from './card.module.css';
import { StatusBadge, StatusIndicator } from './status';

export function getBadgeProps(status: string) {
  switch (status) {
    case 'FINISHED':
      return { color: 'gray', text: 'ENCERRADO' };
    case 'IN_PROGRESS':
      return { color: 'teal', text: 'PLANO ABERTO' };
    default:
      return { color: 'indigo', text: 'NÃO INICIADO' };
  }
}

export function getPatientSubtitle(patient: PatientAndTreatmentPlan) {
  if (
    patient.lastTreatmentPlanId === null ||
    patient.lastTreatmentPlanUpdatedAt === null
  ) {
    return (
      <>
        Última modificação <b>--/--/--, --:--</b>
      </>
    );
  }

  return (
    <>
      Última modificação{' '}
      <b>
        {patient.lastTreatmentPlanUpdatedAt.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </b>{' '}
      no <b>Plano de tratamento #{patient.lastTreatmentPlanId}</b>
    </>
  );
}

interface PatientCardProps {
  patient: PatientAndTreatmentPlan;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      withBorder
      component={Link}
      href={`/patients/${patient.id}`}
    >
      <Group wrap="nowrap" w="100%">
        <Center>
          <Avatar
            size="lg"
            src={patient?.avatarUrl}
            name={patient.name}
            color="initials"
          />
        </Center>

        <div style={{ flex: 1 }}>
          <Text span fw={600} c="gray.9">
            {patient.name}{' '}
            {patient.lastTreatmentPlanStatus !== null && (
              <StatusIndicator
                status={patient.lastTreatmentPlanStatus}
                className={styles.indicator}
                getProps={getBadgeProps}
              />
            )}
          </Text>

          <Text c="dimmed" size="xs">
            {getPatientSubtitle(patient)}
          </Text>
        </div>

        {patient.lastTreatmentPlanStatus && (
          <StatusBadge
            status={patient.lastTreatmentPlanStatus}
            className={styles.badge}
            getProps={getBadgeProps}
          />
        )}
      </Group>
    </Card>
  );
}
