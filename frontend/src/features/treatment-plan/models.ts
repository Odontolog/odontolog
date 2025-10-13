export type ProcedureFormValues = {
  id?: string;
  name: string;
  teeth: string[];
  plannedSession: number | undefined;
  studySector: string;
};

export type ReviewFormValues = {
  comments: string;
  decision: string;
  grade?: number;
};
