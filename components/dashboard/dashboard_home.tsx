import {
  Users,
  FolderOpen,
  AlertTriangle,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type Props = {
  cases: CaseItem[];
  onOpenPatients: () => void;
  onOpenCase: (caseId: string) => void;
};

const riskColors = {
  Normal: "#22c55e",
  "High Risk": "#ef4444",
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-700",
    Running: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
    Uploaded: "bg-blue-100 text-blue-700",
  };

  return <Badge className={styles[status] || "bg-slate-100 text-slate-700"}>{status}</Badge>;
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    "High Risk": "bg-red-100 text-red-700",
    "Medium Risk": "bg-yellow-100 text-yellow-700",
    Normal: "bg-emerald-100 text-emerald-700",
    Pending: "bg-slate-100 text-slate-600",
  };

  return <Badge className={styles[risk] || "bg-slate-100 text-slate-700"}>{risk}</Badge>;
}

function StatCard({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string;
  icon: any;
  sub?: string;
}) {
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

export default function DashboardHome({ cases, onOpenPatients, onOpenCase }: Props) {
  const totalPatients = cases.length;
  const completedCount = cases.filter((c) => c.status === "Completed").length;
  const highRiskCount = cases.filter((c) => c.risk === "High Risk").length;

  const riskData = [
    { name: "Normal", value: cases.filter((c) => c.risk === "Normal").length },
    { name: "High Risk", value: highRiskCount },
  ].filter((x) => x.value > 0);

  const sexData = [
    { name: "Male", value: cases.filter((c) => c.sex === "Male").length },
    { name: "Female", value: cases.filter((c) => c.sex === "Female").length },
  ];

  const recentCases = cases.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Pyramid imaging analysis overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Patients" value={String(totalPatients)} icon={Users} />
        <StatCard title="Completed Analysis" value={String(completedCount)} icon={FolderOpen} />
        <StatCard title="High Risk" value={String(highRiskCount)} icon={AlertTriangle} />
        <StatCard title="Mean Progress" value="--" icon={BarChart3} />
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
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={riskColors[entry.name as keyof typeof riskColors] || "#94a3b8"} />
                  ))}
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
          <Button variant="ghost" className="gap-1 text-slate-500" onClick={onOpenPatients}>
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
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => onOpenCase(item.id)}
                >
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
