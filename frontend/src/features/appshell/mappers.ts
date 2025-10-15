import { Replace } from '@/shared/utils';
import { PatientAndTreatmentPlan } from './requests';

export type PatientAndTreatmentPlanDTO = Replace<
  PatientAndTreatmentPlan,
  {
    id: number;
    updatedAt: string;
  }
>;

export function mapToPatientandTreatmentPlan(
  dto: PatientAndTreatmentPlanDTO,
): PatientAndTreatmentPlan {
  return {
    ...dto,
    id: dto.id.toString(),
    lastTreatmentPlanUpdatedAt: new Date(dto.lastTreatmentPlanUpdatedAt),
  };
}
