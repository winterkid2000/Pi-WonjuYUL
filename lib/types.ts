export type CaseItem = {
  id: string;
  name: string;
  sex: string;
  age: string;
  status: string;
  diagnosis: string;
  risk: string;
  date: string;
  progress: number;
};

export type CaseDetail = {
  case_id: string;
  patient_name: string;
  sex?: string;
  age?: string;
  status: string;
  diagnosis: string;
  risk: string;
  progress: number;
  probability?: number;
  nifti_path?: string;
  mask_path?: string;
  radiomics_csv?: string;
  error?: string;
};
