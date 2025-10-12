import { Replace } from '@/shared/mappers';
import { ProcedureShort } from '@/shared/models';

export type ProcedureShortDto = Replace<
  ProcedureShort,
  {
    id: number;
    updatedAt: string;
  }
>;

export function mapToProcedureShort(dto: ProcedureShortDto): ProcedureShort {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
  };
}
