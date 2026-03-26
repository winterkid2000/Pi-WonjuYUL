"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ScanSearch,
  FileText,
  Search,
  Bell,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardHome from "@/components/dashboard/dashboard_home";
import PatientsPage from "@/components/dashboard/patients_page";
import AnalysisPage from "@/components/dashboard/analysis_page";
import ReportsPage from "@/components/dashboard/reports_page";

const API_BASE = "http://127.0.0.1:8000";

type CaseItem = {
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

type CaseDetail = {
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

function navIcon(label: string) {
  const map: Record<string, any> = {
    Dashboard: LayoutDashboard,
    Patients: Users,
    Analysis: ScanSearch,
    Reports: FileText,
  };
  return map[label] || LayoutDashboard;
}

function SidebarItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = navIcon(label);
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function mapApiCaseToUi(item: any): CaseItem {
  return {
    id: item.case_id,
    name: item.patient_name || "UNKNOWN",
    sex: item.sex || "Unknown",
    age: item.age || "-",
    status: item.status || "Uploaded",
    diagnosis: item.diagnosis || "Pending",
    risk: item.risk || "Pending",
    date: item.created_at?.slice(0, 10) || "-",
    progress: item.progress ?? 0,
  };
}

async function fetchCases() {
  const response = await fetch(`${API_BASE}/cases`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cases");
  }

  return response.json();
}

async function fetchCaseDetail(caseId: string) {
  const response = await fetch(`${API_BASE}/cases/${caseId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch case detail");
  }

  return response.json();
}

async function uploadCase(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE}/cases/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload case");
  }

  return response.json();
}

async function runCase(caseId: string) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/run`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to start pipeline");
  }

  return response.json();
}

export default function Page() {
  const [page, setPage] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<CaseDetail | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    let mounted = true;

    async function loadCases() {
      try {
        setIsRefreshing(true);
        const data = await fetchCases();
        if (!mounted) return;
        setCases(data.map(mapApiCaseToUi));
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load cases");
      } finally {
        if (mounted) setIsRefreshing(false);
      }
    }

    loadCases();
    const interval = setInterval(loadCases, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (!selectedCaseId) return;

    let mounted = true;

    async function loadCaseDetail() {
      try {
        setAnalysisLoading(true);
        const data = await fetchCaseDetail(selectedCaseId);
        if (!mounted) return;
        setSelectedCaseDetail(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load case detail");
      } finally {
        if (mounted) setAnalysisLoading(false);
      }
    }

    loadCaseDetail();
    const interval = setInterval(loadCaseDetail, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedCaseId]);

  const filteredCases = useMemo(() => {
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter((c) =>
      [c.id, c.name, c.sex, c.status, c.diagnosis, c.risk].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [query, cases]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(event.target.files || []);
    if (!fileList.length) return;

    try {
      setIsUploading(true);
      setError("");

      const uploaded = await uploadCase(fileList);
      await runCase(uploaded.case_id);

      setSelectedCaseId(uploaded.case_id);
      setPage("Patients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      const data = await fetchCases();
      setCases(data.map(mapApiCaseToUi));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh cases");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleRunCase(caseId: string) {
    try {
      await runCase(caseId);
      setSelectedCaseId(caseId);
      setPage("Analysis");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run case");
    }
  }

  function openCase(caseId: string) {
    setSelectedCaseId(caseId);
    setPage("Analysis");
  }

  const renderPage = () => {
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
          isUploading={isUploading}
          onUpload={handleUpload}
          onRefresh={handleRefresh}
          onSelectCase={openCase}
          onRunCase={handleRunCase}
        />
      );
    }

    if (page === "Analysis") {
      return (
        <AnalysisPage
          caseDetail={selectedCaseDetail}
          loading={analysisLoading}
        />
      );
    }

    if (page === "Reports") {
      return <ReportsPage />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-[#08152f] text-white lg:flex">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-2xl font-bold tracking-tight">PI Dashboard</div>
            <div className="mt-1 text-xs text-slate-300">
              Pyramid Imaging Platform
            </div>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {["Dashboard", "Patients", "Analysis", "Reports"].map((item) => (
                <SidebarItem
                  key={item}
                  label={item}
                  active={page === item}
                  onClick={() => setPage(item)}
                />
              ))}
            </div>
          </nav>

          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                <Clock3 className="h-4 w-4" />
                Planned Modules
              </div>
              <div>OCR PDF intake</div>
              <div>RT-DICOM import/export</div>
              <div>Radiomics prediction</div>
              <div>TotalSegmentator pipeline</div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold">Pyramid Imaging Dashboard</div>
                <div className="text-sm text-slate-500">
                  Web frontend for DICOM → NIfTI → Segmentation → Radiomics → Prediction
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-[320px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search patient, case, diagnosis..."
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="p-5">
            <div className="mb-4 min-h-[44px]">
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : (
                <div className="rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm text-slate-500">
                  {isRefreshing ? "Refreshing case status..." : ""}
                </div>
              )}
            </div>

            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
