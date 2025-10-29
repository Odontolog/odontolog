'use client';

import { Badge, Box, Indicator, Tooltip } from '@mantine/core';

import {
  ProcedureStatus,
  ReviewStatus,
  TreatmentPlanStatus,
} from '@/shared/models';

interface StatusProps {
  status: ReviewStatus | TreatmentPlanStatus | ProcedureStatus;
  className?: string;
  getProps?: (status: string) => { color: string; text: string };
}

function getBadgeProps(status: string) {
  switch (status) {
    case 'DRAFT':
      return { color: 'gray', text: 'EM ELABORAÇÃO' };
    case 'NOT_STARTED':
      return { color: 'gray', text: 'NÃO INICIADO' };
    case 'IN_PROGRESS':
      return { color: 'blue', text: 'EM ANDAMENTO' };
    case 'IN_REVIEW':
      return { color: 'yellow', text: 'EM REVISÃO' };
    case 'PENDING':
      return { color: 'yellow', text: 'PENDENTE' };
    case 'FINISHED':
      return { color: 'teal', text: 'CONCLUÍDO' };
    case 'APPROVED':
      return { color: 'teal', text: 'APROVADO' };
    case 'DONE':
      return { color: 'teal', text: 'CONCLUÍDO' };
    case 'COMPLETED':
      return { color: 'teal', text: 'CONCLUÍDO' };
    case 'REJECTED':
      return { color: 'red', text: 'REJEITADO' };
    default:
      return { color: 'white', text: '' };
  }
}

export function StatusBadge({
  status,
  className,
  getProps = getBadgeProps,
}: StatusProps) {
  const props = getProps(status);

  return (
    <Badge className={className} variant="light" color={props.color}>
      {props.text}
    </Badge>
  );
}

export function StatusIndicator({
  status,
  className,
  getProps = getBadgeProps,
}: StatusProps) {
  const props = getProps(status);

  return (
    <Tooltip
      label={props.text}
      withArrow
      transitionProps={{ duration: 200 }}
      className={className}
      inline
    >
      <Indicator
        size={8}
        position="middle-center"
        processing
        inline
        color={props.color}
        zIndex={1}
      >
        <Box w={8} h={8} />
      </Indicator>
    </Tooltip>
  );
}
