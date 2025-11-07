import { Mode, TreatmentPlanStatus, UserRole } from '@/shared/models';

const MODE_MATRIX: Record<
  TreatmentPlanStatus,
  Partial<Record<UserRole, Mode>>
> = {
  DRAFT: {
    SUPERVISOR: 'edit',
    STUDENT: 'edit',
  },
  IN_REVIEW: {
    SUPERVISOR: 'read',
    STUDENT: 'read',
  },
  IN_PROGRESS: {
    SUPERVISOR: 'edit',
    STUDENT: 'read',
  },
  DONE: {
    SUPERVISOR: 'read',
    STUDENT: 'read',
  },
};

export function getTreatmentPlanPageMode(
  status: TreatmentPlanStatus,
  role: UserRole,
): Mode {
  return MODE_MATRIX[status]?.[role] ?? 'read';
}
