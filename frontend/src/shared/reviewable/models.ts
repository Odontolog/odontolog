import { Mode, Reviewable, ReviewStatus, Supervisor } from '@/shared/models';
import { UseQueryOptions } from '@tanstack/react-query';

export interface ReviewableComponentProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export interface ReviewableSectionProps<T extends Reviewable>
  extends ReviewableComponentProps<T> {
  mode: Mode;
}

export type SupervisorReviewStatus = Supervisor & {
  reviewStatus: ReviewStatus;
};

export type ReviewFormValues = {
  comments: string;
  decision: string;
  grade?: number;
};
