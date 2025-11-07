import { User } from '@/shared/models';

export type PatientCondition = {
  id: string;
  condition: string;
  description: string;
  notes: string;
  category: string;
  hasCondition: boolean;
};

export type AnamneseActivityType = 'EDIT_NOTES' | 'EDIT_CONDITIONS';

export type AnamneseActivity = {
  id: number;
  type: AnamneseActivityType;
  actor: User;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};

export type AnamneseEditConditionsMetadata = {
  updatedFields: {
    condition: string;
    hasCondition: boolean;
    notes: string;
  }[];
};

export type Anamnese = {
  patientId: string;
  antecedents: string;
  historyOfPresentIllness: string;
  mainComplaint: string;
  notes: string;
  history: AnamneseActivity[];
  conditions: PatientCondition[];
};

export type ConditionFormValue = {
  formIndex: number;
  notes: string;
  hasCondition: boolean;
  condition: string;
  category: string;
  description: string;
};

export type AnamneseFormValues = {
  conditions: ConditionFormValue[];
};
