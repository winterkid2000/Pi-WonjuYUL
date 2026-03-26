
"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ScanSearch,
  Upload,
  FileText,
  AlertTriangle,
  Search,
  Bell,
  RefreshCw,
  ChevronRight,
  Play,
  Eye,
  Download,
  MessageSquare,
  FolderOpen,
  BarChart3,
  Layers3,
  Clock3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ...all the rest of the code from react_frontend.tsx, including all functions and the default export...
const riskData = [
  { name: "Normal", value: 9 },
  { name: "High Risk", value: 7 },
];

const sexData = [
  { name: "Male", value: 2 },
  { name: "Female", value: 14 },
];

const recentCases = [
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
  {
    id: "case_003",
    name: "DOE JANE",
    sex: "Female",
    age: "49Y",
    status: "Completed",
    diagnosis: "Normal",
    risk: "Medium Risk",
    date: "2026-03-09",
    progress: 100,
  },
  {
    id: "case_004",
    name: "DOE JOHN",
    sex: "Male",
    age: "57Y",
    status: "Failed",
    diagnosis: "Pending",
    risk: "Pending",
    date: "2026-03-08",
    progress: 34,
  },
];

const pipelineSteps = [
  { step: "Upload", desc: "DICOM or PDF intake", done: true },
  { step: "Conversion", desc: "DICOM to NIfTI RAS", done: true },
  { step: "Segmentation", desc: "TotalSegmentator", done: true },
  { step: "Radiomics", desc: "Feature extraction", done: true },
  { step: "Inference", desc: "Risk prediction", done: false },
  { step: "Report", desc: "LLM report generation", done: false },
];

const shapFeatures = [
  { name: "original_glcm_Contrast", value: 0.31 },
  { name: "wavelet_HHL_firstorder_Kurtosis", value: 0.28 },
  { name: "log_sigma_3_glszm_LargeArea", value: 0.22 },
  { name: "original_shape_Elongation", value: 0.17 },
  { name: "wavelet_LLL_glrlm_RunEntropy", value: 0.13 },
];

function navIcon(label: string) {
  const map = {
    Dashboard: LayoutDashboard,
    Patients: Users,
    Analysis: ScanSearch,
    Reports: FileText,
  };
  return map[label] || LayoutDashboard;
}

function SidebarItem({ active, label, onClick }: any) {
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

function StatCard({ title, value, icon: Icon, sub }: any) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {sub ? <p className="mt-2 text-xs text-slate-500">{sub}</p> : null}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: any) {
  const styles = {
    Completed: "bg-emerald-100 text-emerald-700",
    Running: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
    Uploaded: "bg-blue-100 text-blue-700",
  };
  return <Badge className={styles[status] || "bg-slate-100 text-slate-700"}>{status}</Badge>;
}

function RiskBadge({ risk }: any) {
  const styles = {
    "High Risk": "bg-red-100 text-red-700",
    "Medium Risk": "bg-yellow-100 text-yellow-700",
    Normal: "bg-emerald-100 text-emerald-700",
    Pending: "bg-slate-100 text-slate-600",
  };
  return <Badge className={styles[risk] || "bg-slate-100 text-slate-700"}>{risk}</Badge>;
}

function DashboardHome({ onOpenCase }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Pyramid imaging analysis and radiomics overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Patients" value="14" icon={Users} sub="Stored cases in local database" />
        <StatCard title="Completed Analysis" value="16" icon={FolderOpen} sub="Including reruns and reports" />
        <StatCard title="High Risk" value="7" icon={AlertTriangle} sub="Flagged by prediction model" />
        <StatCard title="Mean Index" value="62.8" icon={BarChart3} sub="Current dashboard snapshot" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sexData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Analysis Results</CardTitle>
          <Button variant="ghost" className="gap-1 text-slate-500" onClick={onOpenCase}>
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCases.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={onOpenCase}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sex}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>{item.diagnosis}</TableCell>
                  <TableCell><RiskBadge risk={item.risk} /></TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PatientsPage({ onSelectCase, cases }: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">Case list, upload entry point, and analysis queue</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 rounded-xl"><Upload className="h-4 w-4" />Upload DICOM</Button>
          <Button variant="outline" className="gap-2 rounded-xl"><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <Card className="rounded-2xl border-dashed border-2 bg-slate-50">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><Upload className="h-8 w-8 text-slate-700" /></div>
          <div>
            <p className="text-base font-medium">Upload a new case</p>
            <p className="text-sm text-slate-500">DICOM folder, RT-DICOM, NIfTI, PDF OCR, and metadata intake area</p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-xl">Choose Files</Button>
            <Button variant="outline" className="rounded-xl">Connect PACS Later</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Case Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell className="min-w-[180px]">
                    <div className="space-y-2">
                      <Progress value={item.progress} />
                      <p className="text-xs text-slate-500">{item.progress}%</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.diagnosis}</TableCell>
                  <TableCell><RiskBadge risk={item.risk} /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={onSelectCase}><Eye className="h-4 w-4" />Open</Button>
                      <Button size="sm" className="gap-1"><Play className="h-4 w-4" />Run</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analysis Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Viewer, segmentation, radiomics, report, and chat in one layout</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="rounded-2xl xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Image Viewer</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Axial</Button>
              <Button variant="outline" size="sm">Coronal</Button>
              <Button variant="outline" size="sm">Sagittal</Button>
              <Button size="sm">3D</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-center text-slate-500">
              <div>
                <Layers3 className="mx-auto mb-3 h-10 w-10" />
                <p className="font-medium">Viewer placeholder</p>
                <p className="text-sm">OHIF, Cornerstone, or custom NIfTI/RT overlay viewer goes here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Pipeline Monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineSteps.map((item, idx) => (
              <div key={item.step} className="flex items-start gap-3 rounded-xl border p-3">
                <div className={`mt-1 h-3 w-3 rounded-full ${item.done ? "bg-emerald-500" : idx === 4 ? "bg-amber-500" : "bg-slate-300"}`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.step}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <Badge className={item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                  {item.done ? "Done" : "Waiting"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="radiomics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="radiomics">Radiomics</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="radiomics">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="text-base">Top SHAP Features</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {shapFeatures.map((feature) => (
                  <div key={feature.name} className="space-y-2 rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{feature.name}</p>
                      <p className="text-sm text-slate-500">{feature.value.toFixed(2)}</p>
                    </div>
                    <Progress value={feature.value * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="text-base">Feature Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-xl border p-4">HU histogram panel</div>
                <div className="rounded-xl border p-4">Shape descriptor summary</div>
                <div className="rounded-xl border p-4">OCR-extracted patient info</div>
                <div className="rounded-xl border p-4">RT-DICOM import/export status</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prediction">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="rounded-2xl"><CardContent className="p-6"><p className="text-sm text-slate-500">Diagnosis</p><p className="mt-2 text-2xl font-semibold">Myosteatosis</p></CardContent></Card>
            <Card className="rounded-2xl"><CardContent className="p-6"><p className="text-sm text-slate-500">Probability</p><p className="mt-2 text-2xl font-semibold">0.84</p></CardContent></Card>
            <Card className="rounded-2xl"><CardContent className="p-6"><p className="text-sm text-slate-500">Model</p><p className="mt-2 text-2xl font-semibold">FT-Transformer</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="report">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Regenerate</Button>
                <Button className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="min-h-[260px] rounded-2xl border bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                Report text area placeholder. This connects to the report generation worker and displays the LLM-generated clinical summary.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-base">Chat with Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[240px] rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                Chat history placeholder. Connect this to your BioMistral or DeepSeek worker later.
              </div>
              <div className="flex gap-2">
                <Input placeholder="Ask about the report, SHAP features, or patient context..." />
                <Button className="gap-2"><MessageSquare className="h-4 w-4" />Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Generated summaries, exports, and review state</p>
      </div>
      <Card className="rounded-2xl">
        <CardContent className="p-6 text-sm text-slate-600">
          Report management page placeholder. Add signed-off status, PDF history, and versioning here.
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  const [page, setPage] = useState("Dashboard");
  const [query, setQuery] = useState("");

  const filteredCases = useMemo(() => {
    if (!query.trim()) return recentCases;
    const q = query.toLowerCase();
    return recentCases.filter((c) =>
      [c.id, c.name, c.sex, c.status, c.diagnosis, c.risk].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const renderPage = () => {
    if (page === "Dashboard") return <DashboardHome onOpenCase={() => setPage("Patients")} />;
    if (page === "Patients") return <PatientsPage onSelectCase={() => setPage("Analysis")} cases={filteredCases} />;
    if (page === "Analysis") return <AnalysisPage />;
    if (page === "Reports") return <ReportsPage />;
    return <DashboardHome onOpenCase={() => setPage("Patients")} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-[#08152f] text-white lg:flex">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-2xl font-bold tracking-tight">Pi</div>
            <div className="mt-1 text-xs text-slate-300">Pi-WonjuYUL(Yonsei Univ Laboratory)</div>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {["Dashboard", "Patients", "Analysis", "Reports"].map((item) => (
                <SidebarItem key={item} label={item} active={page === item} onClick={() => setPage(item)} />
              ))}
            </div>
          </nav>

          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                <Clock3 className="h-4 w-4" />Planned Modules
              </div>
              <div>OCR PDF intake</div>
              <div>RT-DICOM import/export</div>
              <div>BioMistral / DeepSeek chat</div>
              <div>TotalSegmentator + Radiomics</div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold">Pyramid Imaging Dashboard</div>
                <div className="text-sm text-slate-500">Web frontend skeleton for your current desktop workflow</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-[320px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, case, diagnosis..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon"><Bell className="h-4 w-4" /></Button>
                <Button>New Case</Button>
              </div>
            </div>
          </header>

          <div className="p-5">
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

