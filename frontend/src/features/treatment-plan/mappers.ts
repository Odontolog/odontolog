import { ActivityDto, mapToActivity, Replace } from '@/shared/mappers';
import { TreatmentPlan } from '@/shared/models';

export type TreatmentPlanDto = Replace<
  TreatmentPlan,
  {
    id: number;
    updatedAt: string;
    history: ActivityDto[];
  }
>;

export function mapToTreatmentPlan(dto: TreatmentPlanDto): TreatmentPlan {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
    history: dto.history.map((a) => mapToActivity(a)),
  };
}
