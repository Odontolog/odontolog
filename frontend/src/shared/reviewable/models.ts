import { Mode, Reviewable, ReviewStatus, Supervisor } from '@/shared/models';
import { UseQueryOptions } from '@tanstack/react-query';

export interface ReviewableSectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
  mode: Mode;
}

export type SupervisorReviewStatus = Supervisor & {
  reviewStatus: ReviewStatus;
};
