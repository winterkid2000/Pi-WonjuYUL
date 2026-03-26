import { Card, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generated summaries, exports, and review state
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6 text-sm text-slate-600">
          Report management page placeholder. Add signed-off status, PDF history,
          and versioning here.
        </CardContent>
      </Card>
    </div>
  );
}
