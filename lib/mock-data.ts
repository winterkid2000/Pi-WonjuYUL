// lib/mock-data.ts

import { CaseItem } from "./types";

export const mockCases: CaseItem[] = [
  {
    id: "case_001",
    patient: {
      id: "p001",
      name: "Jane Doe",
      sex: "Female",
      age: 54,
    },
    status: "Completed",
    date: "2026-03-10",
    progress: 100,
    result: {
      diagnosis: "Myosteatosis",
      risk: "High Risk",
      probability: 0.87,
    },
  },
  {
    id: "case_002",
    patient: {
      id: "p002",
      name: "John Smith",
      sex: "Male",
      age: 61,
    },
    status: "Processing",
    date: "2026-03-15",
    progress: 65,
  },
  {
    id: "case_003",
    patient: {
      id: "p003",
      name: "Emily Chen",
      sex: "Female",
      age: 47,
    },
    status: "Pending",
    date: "2026-03-20",
    progress: 10,
  },
  {
    id: "case_004",
    patient: {
      id: "p004",
      name: "Carlos Ruiz",
      sex: "Male",
      age: 58,
    },
    status: "Completed",
    date: "2026-03-05",
    progress: 100,
    result: {
      diagnosis: "Normal",
      risk: "Low Risk",
      probability: 0.12,
    },
  },
];
