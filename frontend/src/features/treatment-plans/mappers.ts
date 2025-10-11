import { TreatmentPlanShort } from '@/shared/models';
import { Replace } from '@/shared/utils';

export type TreatmentPlanShortDto = Replace<
  TreatmentPlanShort,
  {
    id: number;
    updatedAt: string;
  }
>;

export function mapToTreatmentPlanShort(
  dto: TreatmentPlanShortDto,
): TreatmentPlanShort {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
  };
}
