import { ReviewableShort } from '@/shared/models';
import { mockTreatmentPlans, procedures } from './treatment-plan';

export const mockReviewables: ReviewableShort[] = [
  ...mockTreatmentPlans,
  ...procedures,
];
