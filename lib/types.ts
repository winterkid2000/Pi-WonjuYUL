export type CaseStatus = "Pending" | "Processing" | "Completed" | "Error";

export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";

export type PatientInfo = {
  id: string;
  name: string;
  sex: "Male" | "Female";
  age: number;
};

export type AnalysisResult = {
  diagnosis: string;
  risk: RiskLevel;
  probability: number; // 0 ~ 1
};

export type CaseItem = {
  id: string;
  patient: PatientInfo;
  status: CaseStatus;
  date: string;
  progress: number; // 0 ~ 100
  result?: AnalysisResult;
};
