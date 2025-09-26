import { Mode, TreatmentPlanStatus, UserRole } from '@/shared/models';

const MODE_MATRIX: Record<
  TreatmentPlanStatus,
  Partial<Record<UserRole, Mode>>
> = {
  draft: {
    supervisor: 'read',
    student: 'edit',
  },
  in_review: {
    supervisor: 'read',
    student: 'read',
  },
  in_progress: {
    supervisor: 'edit',
    student: 'read',
  },
  done: {
    supervisor: 'read',
    student: 'read',
  },
};

export function getTreatmentPlanPageMode(
  status: TreatmentPlanStatus,
  role: UserRole,
): Mode {
  return MODE_MATRIX[status]?.[role] ?? 'read';
}
