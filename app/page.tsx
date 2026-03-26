"use client";

import { useMemo, useState } from "react";
import DashboardHome from "@/components/dashboard/dashboard_home";
import PatientsPage from "@/components/dashboard/patients_page";
import AnalysisPage from "@/components/dashboard/analysis_page";
import ReportsPage from "@/components/dashboard/reports_page";
import { mockCases, mockCaseDetail } from "@/lib/mock-data";

export default function Page() {
  const [page, setPage] = useState<"Dashboard" | "Patients" | "Analysis" | "Reports">("Dashboard");
  const [query, setQuery] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    if (!query.trim()) return mockCases;
    const q = query.toLowerCase();
    return mockCases.filter((c) =>
      [c.id, c.name, c.sex, c.status, c.diagnosis, c.risk].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [query]);

  function openCase(caseId: string) {
    setSelectedCaseId(caseId);
    setPage("Analysis");
  }

  if (page === "Dashboard") {
    return (
      <DashboardHome
        cases={filteredCases}
        onOpenPatients={() => setPage("Patients")}
        onOpenCase={openCase}
      />
    );
  }

  if (page === "Patients") {
    return (
      <PatientsPage
        cases={filteredCases}
        isUploading={false}
        onUpload={() => {}}
        onRefresh={() => {}}
        onSelectCase={openCase}
        onRunCase={() => {}}
      />
    );
  }

  if (page === "Analysis") {
    return <AnalysisPage caseDetail={mockCaseDetail[selectedCaseId ?? "case_001"]} loading={false} />;
  }

  return <ReportsPage />;
}
