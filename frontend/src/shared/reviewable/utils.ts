import { Review, Supervisor } from '@/shared/models';
import { SupervisorReviewStatus } from './models';

export function getSupervisorReviewStatus(
  reviews: Review[],
  reviewers: Supervisor[],
): SupervisorReviewStatus[] {
  return reviewers.map((reviewer) => {
    const lastReview = reviews
      .filter((review) => review.supervisor.id === reviewer.id)
      .sort((a, b) => b.id.localeCompare(a.id)) // TODO: Melhorar forma de pegar a review mais recente
      .at(0);

    return {
      ...reviewer,
      reviewStatus:
        lastReview !== undefined ? lastReview.reviewStatus : 'DRAFT',
    };
  });
}
