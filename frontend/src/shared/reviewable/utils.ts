import {
  Activity,
  ProcedureStatus,
  Review,
  Reviewable,
  Supervisor,
  TreatmentPlanStatus,
} from '@/shared/models';
import { SupervisorReviewStatus } from './models';
import { type User } from 'next-auth';

export function getSupervisorReviewStatus(
  reviews: Review[],
  reviewers: Supervisor[],
): SupervisorReviewStatus[] {
  return reviewers.map((reviewer) => {
    const lastReview = reviews
      .filter((review) => review.supervisor.id === reviewer.id)
      .sort((a, b) => +b.id - +a.id) // TODO: Melhorar forma de pegar a review mais recente
      .at(0);

    return {
      ...reviewer,
      reviewStatus:
        lastReview !== undefined ? lastReview.reviewStatus : 'DRAFT',
    };
  });
}

export function getActivityTitleFn(reviewableType: Reviewable['type']) {
  let name;
  switch (reviewableType) {
    case 'PROCEDURE':
      name = 'Procedimento';
      break;
    case 'TREATMENT_PLAN':
      name = 'Plano';
      break;
    default:
      throw new Error('Reviewable type does not exist.');
  }

  return (activity: Activity): string => {
    switch (activity.type) {
      case 'CREATED':
        return `${name} criado`;
      case 'EDITED':
        return `${name} modificado`;
      case 'REVIEW_REQUESTED':
        return `Pedido de validação realizado`;
      case 'REVIEW_APPROVED':
        return `${name} aprovado`;
      case 'REVIEW_REJECTED':
        return `${name} rejeitado`;
      default:
        throw new Error('Activity type does not exist.');
    }
  };
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

export function canSupervisorReview(
  user: User,
  status: ProcedureStatus | TreatmentPlanStatus,
  reviewers: Supervisor[],
  reviews: Review[],
): boolean {
  if (user.role !== 'SUPERVISOR') {
    throw new Error(
      'This function can only be used when supervisor is logged in.',
    );
  }

  const isInReview = status === 'IN_REVIEW';
  const isReviewRequested = !!reviewers.find((r) => r.id === user.id);

  const supervisorReview = reviews.find((r) => r.supervisor.id === user.id);
  const isReviewPeding = supervisorReview?.reviewStatus === 'PENDING';

  return isInReview && isReviewRequested && isReviewPeding;
}
