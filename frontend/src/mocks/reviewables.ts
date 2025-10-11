import { ReviewableShort } from '@/shared/models';
import { mockTreatmentPlans, proceduresShort } from './treatment-plan';

export const mockReviewables: ReviewableShort[] = [
  ...mockTreatmentPlans,
  ...proceduresShort,
];
