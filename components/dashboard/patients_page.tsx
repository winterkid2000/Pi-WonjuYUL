import { Upload, RefreshCw, Eye, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  isUploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onSelectCase: (caseId: string) => void;
  onRunCase?: (caseId: string) => void;
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

cases.map((c) => (
  <div key={c.id}>
    {c.patient.name} - {c.status}
  </div>
))

export default function PatientsPage({
  cases,
  isUploading,
  onUpload,
  onRefresh,
  onSelectCase,
  onRunCase,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">Case list, upload entry point, and analysis queue</p>
        </div>
        <div className="flex gap-2">
          <label>
            <input type="file" multiple className="hidden" onChange={onUpload} />
            <Button asChild className="gap-2 rounded-xl" disabled={isUploading}>
              <span>
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload DICOM"}
              </span>
            </Button>
          </label>
          <Button variant="outline" className="gap-2 rounded-xl" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-dashed border-2 bg-slate-50">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Upload className="h-8 w-8 text-slate-700" />
          </div>
          <div>
            <p className="text-base font-medium">Upload a new case</p>
            <p className="text-sm text-slate-500">
              DICOM folder, RT-DICOM, NIfTI, PDF OCR, and metadata intake area
            </p>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onSelectCase(item.id)}
                      >
                        <Eye className="h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => onRunCase?.(item.id)}
                      >
                        <Play className="h-4 w-4" />
                        Run
                      </Button>
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
