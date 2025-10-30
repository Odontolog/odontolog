import { Patient } from '@/shared/models';
import { Replace } from '@/shared/utils';
import { JSX } from 'react';
import {
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
} from '@tabler/icons-react';

export type PatientDTO = Replace<
  Patient,
  {
    id: number;
    birthDate: string;
    updatedAt: string;
  }
>;

export function mapToPatient(dto: PatientDTO): Patient {
  return {
    ...dto,
    id: dto.id.toString(),
    birthDate: new Date(`${dto.birthDate}T00:00:00.000`),
  };
}

export const genderMap: Record<string, { icon: JSX.Element; label: string }> = {
  MALE: { icon: <IconGenderMale size={16} />, label: 'Masculino' },
  FEMALE: { icon: <IconGenderFemale size={16} />, label: 'Feminino' },
  OTHER: { icon: <IconGenderAgender size={16} />, label: 'Outro' },
};

export const ethnicityMap: Record<string, string> = {
  WHITE: 'Branca',
  BLACK: 'Preta',
  BROWN: 'Parda',
  YELLOW: 'Amarela',
  INDIGENOUS: 'Indígena',
  OTHER: 'Outra',
};

export const maritalStatusMap: Record<string, string> = {
  SINGLE: 'Solteiro',
  MARRIED: 'Casado',
  DIVORCED: 'Divorciado',
  WIDOWED: 'Viúvo',
  CIVIL_UNION: 'União Estável',
  OTHER: 'Outra',
};

export const getGenderDisplay = (sex?: string) => {
  if (sex === undefined || sex === null || sex === '' || !(sex in genderMap)) {
    return { icon: null, label: 'Não informado' };
  }
  return genderMap[sex];
};

export const getEthnicityDisplay = (ethnicity?: string) => {
  if (
    ethnicity === undefined ||
    ethnicity === null ||
    ethnicity === '' ||
    !(ethnicity in ethnicityMap)
  ) {
    return 'Não informado';
  }
  return ethnicityMap[ethnicity];
};

export const getMaritalStatusDisplay = (maritalStatus?: string) => {
  if (
    maritalStatus === undefined ||
    maritalStatus === null ||
    maritalStatus === '' ||
    !(maritalStatus in maritalStatusMap)
  ) {
    return 'Não informado';
  }
  return maritalStatusMap[maritalStatus];
};

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};
