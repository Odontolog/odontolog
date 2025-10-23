export type PatientRecordForm = {
  id?: string;
  name: string;
  birthDate: Date;
  phoneNumber: string;
  cpf: string;
  rg: string;
  ssp: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'CIVIL_UNION';
  sex: 'FEMALE' | 'MALE' | 'OTHER';
  ethnicity: 'WHITE' | 'BLACK' | 'BROWN' | 'YELLOW' | 'INDIGENOUS' | 'OTHER';
  address: string;
  city: string;
  state: string;
  occupation: string;
};
