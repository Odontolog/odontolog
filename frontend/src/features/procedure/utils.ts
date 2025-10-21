import { Mode, ProcedureStatus, UserRole } from '@/shared/models';

const MODE_MATRIX: Record<ProcedureStatus, Partial<Record<UserRole, Mode>>> = {
  DRAFT: {
    SUPERVISOR: 'read',
    STUDENT: 'read',
  },
  NOT_STARTED: {
    SUPERVISOR: 'edit',
    STUDENT: 'edit',
  },
  IN_REVIEW: {
    SUPERVISOR: 'read',
    STUDENT: 'read',
  },
  IN_PROGRESS: {
    SUPERVISOR: 'edit',
    STUDENT: 'edit',
  },
  COMPLETED: {
    SUPERVISOR: 'read',
    STUDENT: 'read',
  },
};

export function getProcedurePageMode(
  status: ProcedureStatus,
  role: UserRole,
): Mode {
  return MODE_MATRIX[status]?.[role] ?? 'read';
}
