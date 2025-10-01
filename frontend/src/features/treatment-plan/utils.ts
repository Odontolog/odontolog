import { Activity, Mode, TreatmentPlanStatus, UserRole } from '@/shared/models';

const MODE_MATRIX: Record<
  TreatmentPlanStatus,
  Partial<Record<UserRole, Mode>>
> = {
  DRAFT: {
    SUPERVISOR: 'read',
    STUDENT: 'edit',
  },
  IN_REVIEW: {
    SUPERVISOR: 'read',
    STUDENT: 'edit',
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

export function getLatestActorAndDate(
  activities: Activity[],
): { actor: string; createdAt: Date } | undefined {
  if (activities.length === 0) {
    return undefined;
  }

  const latest = activities.reduce((a, b) =>
    a.createdAt > b.createdAt ? a : b,
  );

  return {
    actor: latest.actor.name,
    createdAt: latest.createdAt,
  };
}
