import { Mode, Reviewable } from '@/shared/models';
import { UseQueryOptions } from '@tanstack/react-query';

export interface ReviewableSectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
  mode: Mode;
}
