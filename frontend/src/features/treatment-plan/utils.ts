import { Activity, Mode, TreatmentPlanStatus, UserRole } from '@/shared/models';

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
