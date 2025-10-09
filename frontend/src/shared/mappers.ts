import { Activity } from './models';

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
