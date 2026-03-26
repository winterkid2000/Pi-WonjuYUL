import type { CaseItem, CaseDetail } from "@/lib/types";

export const mockCases: CaseItem[] = [
  {
    id: "case_001",
    name: "DOE JANE",
    sex: "Female",
    age: "54Y",
    status: "Completed",
    diagnosis: "Myosteatosis",
    risk: "High Risk",
    date: "2026-03-10",
    progress: 100,
  },
  {
    id: "case_002",
    name: "DOE JANE",
    sex: "Female",
    age: "61Y",
    status: "Running",
    diagnosis: "Pending",
    risk: "Pending",
    date: "2026-03-10",
    progress: 68,
  },
];

export const mockCaseDetail: Record<string, CaseDetail> = {
  case_001: {
    case_id: "case_001",
    patient_name: "DOE JANE",
    sex: "Female",
    age: "54Y",
    status: "Completed",
    diagnosis: "Myosteatosis",
    risk: "High Risk",
    progress: 100,
    probability: 0.84,
    nifti_path: "/demo/nifti/case_001.nii.gz",
    mask_path: "/demo/masks/case_001_mask.nii.gz",
    radiomics_csv: "/demo/radiomics/case_001.csv",
  },
};
