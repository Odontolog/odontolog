import { Activity, Review, Reviewable, Supervisor } from '@/shared/models';
import { SupervisorReviewStatus } from './models';

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
