import { ProcedureShort, TreatmentPlanShort } from '@/shared/models';
import { mockTreatmentPlans, procedures } from './treatment-plan';

export const mockReviewables: Array<TreatmentPlanShort | ProcedureShort> = [
  ...mockTreatmentPlans,
  ...procedures,
];
