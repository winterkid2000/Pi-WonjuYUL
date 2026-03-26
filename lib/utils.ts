import { CaseStatus, RiskLevel } from "./types";

export function getStatusColor(status: CaseStatus) {
  switch (status) {
    case "Completed":
      return "text-green-400";
    case "Processing":
      return "text-yellow-400";
    case "Pending":
      return "text-gray-400";
    case "Error":
      return "text-red-400";
    default:
      return "";
  }
}

export function getRiskColor(risk: RiskLevel) {
  switch (risk) {
    case "Low Risk":
      return "text-green-400";
    case "Medium Risk":
      return "text-yellow-400";
    case "High Risk":
      return "text-red-400";
    default:
      return "";
  }
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
