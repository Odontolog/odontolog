import { Activity, TreatmentPlan } from '@/shared/models';
import { Replace } from '@/shared/utils';

export type ActivityDto = Replace<
  Activity,
  {
    createdAt: string;
  }
>;

export type TreatmentPlanDto = Replace<
  TreatmentPlan,
  {
    id: number;
    updatedAt: string;
    history: ActivityDto[];
  }
>;

function mapToActivity(dto: ActivityDto): Activity {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
  };
}

export function mapToTreatmentPlan(dto: TreatmentPlanDto): TreatmentPlan {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
    history: dto.history.map((a) => mapToActivity(a)),
  };
}
