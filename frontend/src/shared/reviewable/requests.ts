import { queryOptions, UseQueryOptions } from '@tanstack/react-query';

import { supervisors } from '@/mocks/supervisor';
import { HasReviewable, Review, Supervisor } from '@/shared/models';
import {
  updateReviews,
  treatmentPlanMock,
  setNote,
} from '@/mocks/treatment-plan';

export function createReviewableOptions<T extends HasReviewable>(
  queryKey: string[],
  queryFn: () => Promise<T>,
) {
  return queryOptions({
    queryKey,
    queryFn,
  }) as UseQueryOptions<HasReviewable, Error, HasReviewable, string[]>;
}

export async function getAvailableSupervisors(): Promise<Supervisor[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return supervisors;
}

export async function saveSupervisors(
  reviewableId: string,
  selectedSupervisorIds: string[],
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const selectedSupervisors = selectedSupervisorIds
    .map((id) => {
      return supervisors.find((sup) => sup.id === id);
    })
    .filter((val) => val !== undefined);

  const reviews = selectedSupervisors.map((sup) => {
    const existingReview = treatmentPlanMock.reviewable.reviews.find(
      (rev) => rev.supervisor.id === sup.id,
    );
    if (existingReview) {
      return existingReview;
    }
    return {
      id: Math.floor(Math.random() * 10000).toString(),
      note: '',
      grade: 0.0,
      status: 'draft',
      supervisor: sup,
    } as Review;
  });

  updateReviews(reviews);

  console.log('Saved to backend (mock):', { reviewableId, reviews });
  return { success: true };
}

export async function saveDetails(reviewableId: string, note: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('saving data', note, reviewableId);
  // throw new Error('error saving data');
  setNote(note);
  return { success: true };
}
