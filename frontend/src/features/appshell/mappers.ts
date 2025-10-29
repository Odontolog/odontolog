import { PatientAndTreatmentPlan } from '@/shared/models';
import { Replace } from '@/shared/utils';

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
  const lastTPUpdatedAt =
    dto.lastTreatmentPlanUpdatedAt === null
      ? null
      : new Date(dto.lastTreatmentPlanUpdatedAt);

  return {
    ...dto,
    id: dto.id.toString(),
    lastTreatmentPlanUpdatedAt: lastTPUpdatedAt,
  };
}
