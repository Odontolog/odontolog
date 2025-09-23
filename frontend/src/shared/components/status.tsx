'use client';

import { Badge, Box, Indicator, Tooltip } from '@mantine/core';
import { ProcedureStatus, ReviewStatus, TreatmentPlanStatus } from '../models';

interface StatusProps {
  status: ReviewStatus | TreatmentPlanStatus | ProcedureStatus;
  className?: string;
}

function getBadgeProps(status: string) {
  switch (status) {
    case 'draft':
      return { color: 'gray', text: 'EM ELABORAÇÃO' };
    case 'not_started':
      return { color: 'gray', text: 'NÃO INICIADO' };
    case 'in_progress':
      return { color: 'blue', text: 'EM ANDAMENTO' };
    case 'in_review':
      return { color: 'yellow', text: 'EM REVISÃO' };
    case 'pending':
      return { color: 'yellow', text: 'PENDENTE' };
    case 'finished':
      return { color: 'teal', text: 'CONCLUÍDO' };
    case 'approved':
      return { color: 'teal', text: 'APROVADO' };
    case 'done':
      return { color: 'teal', text: 'CONCLUÍDO' };
    case 'rejected':
      return { color: 'red', text: 'REJEITADO' };
    default:
      return { color: 'white', text: null };
  }
}

export function StatusBadge({ status, className }: StatusProps) {
  const props = getBadgeProps(status);

  return (
    <Badge className={className} variant="light" color={props.color}>
      {props.text}
    </Badge>
  );
}

export function StatusIndicator({ status, className }: StatusProps) {
  const props = getBadgeProps(status);

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
      >
        <Box w={8} h={8} />
      </Indicator>
    </Tooltip>
  );
}
