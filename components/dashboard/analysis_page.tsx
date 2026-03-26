import { Layers3, RefreshCw, Download, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

type Props = {
  caseDetail: CaseDetail | null;
  loading: boolean;
};

const pipelineSteps = [
  { step: "Upload", desc: "DICOM or PDF intake" },
  { step: "Conversion", desc: "DICOM to NIfTI RAS" },
  { step: "Segmentation", desc: "TotalSegmentator" },
  { step: "Radiomics", desc: "Feature extraction" },
  { step: "Inference", desc: "Risk prediction" },
  { step: "Report", desc: "LLM report generation" },
];

function getStepState(progress: number, index: number) {
  const thresholds = [5, 20, 45, 70, 90, 100];
  return progress >= thresholds[index];
}

export default function AnalysisPage({ caseDetail, loading }: Props) {
  if (!caseDetail) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Analysis Workspace</h1>
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-sm text-slate-500">
            No case selected.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analysis Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">
          {caseDetail.case_id} · {caseDetail.patient_name}
        </p>
      </div>

      {loading ? (
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-sm text-slate-500">
            Loading case detail...
          </CardContent>
        </Card>
      ) : null}

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
                <p className="text-sm">NIfTI: {caseDetail.nifti_path || "Not ready"}</p>
                <p className="text-sm">Mask: {caseDetail.mask_path || "Not ready"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Pipeline Monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineSteps.map((item, idx) => {
              const done = getStepState(caseDetail.progress, idx);
              return (
                <div key={item.step} className="flex items-start gap-3 rounded-xl border p-3">
                  <div className={`mt-1 h-3 w-3 rounded-full ${done ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.step}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <Badge className={done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                    {done ? "Done" : "Waiting"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-2xl font-semibold">{caseDetail.status}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Diagnosis</p>
            <p className="mt-2 text-2xl font-semibold">{caseDetail.diagnosis}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Risk</p>
            <p className="mt-2 text-2xl font-semibold">{caseDetail.risk}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Probability</p>
            <p className="mt-2 text-2xl font-semibold">
              {caseDetail.probability !== undefined ? Number(caseDetail.probability).toFixed(3) : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <p className="mb-2 text-sm text-slate-500">Overall Progress</p>
          <Progress value={caseDetail.progress} />
          <p className="mt-2 text-sm text-slate-600">{caseDetail.progress}%</p>
          {caseDetail.error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {caseDetail.error}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="radiomics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="radiomics">Radiomics</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="radiomics">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Radiomics Output</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              CSV path: {caseDetail.radiomics_csv || "Not ready"}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Prediction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div>Diagnosis: {caseDetail.diagnosis}</div>
              <div>Risk: {caseDetail.risk}</div>
              <div>
                Probability:{" "}
                {caseDetail.probability !== undefined ? Number(caseDetail.probability).toFixed(3) : "-"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="min-h-[220px] rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
                Report placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Chat with Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[220px] rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                Chat history placeholder
              </div>
              <div className="flex gap-2">
                <Input placeholder="Ask about this case..." />
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
