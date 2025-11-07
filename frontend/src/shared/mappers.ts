import { Activity, PatientAndTreatmentPlan } from './models';

export type Replace<T, R> = Omit<T, keyof R> & R;

export type ActivityDto = Replace<
  Activity,
  {
    createdAt: string;
  }
>;

export function mapToActivity(dto: ActivityDto): Activity {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
  };
}

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
