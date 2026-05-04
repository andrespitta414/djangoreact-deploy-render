import { Activity, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { AdminCharts } from "@/components/AdminCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { useReports } from "@/hooks/useReports";
import { formatDate } from "@/lib/utils";

export function AdminDashboardPage() {
  const { analytics } = useReports();
  const cards = [
    { label: "Total denuncias", value: analytics.total_reports, icon: Activity, color: "text-ocdeBlue" },
    { label: "Pendientes", value: analytics.pending_reports, icon: Clock3, color: "text-amber-500" },
    { label: "Resueltas", value: analytics.resolved_reports, icon: CheckCircle2, color: "text-ocdeGreen" },
    { label: "Anonimas", value: analytics.anonymous_reports, icon: ShieldAlert, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <h3 className="mt-2 text-4xl font-semibold text-slate-950">{card.value}</h3>
              </div>
              <card.icon className={card.color} size={28} />
            </div>
          </article>
        ))}
      </section>
      <AdminCharts analytics={analytics} />
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900">Actividad reciente</h3>
          <p className="text-sm text-slate-500">Ultimos eventos del banco de denuncias</p>
        </div>
        <div className="space-y-4">
          {analytics.recent_reports.map((report) => (
            <div key={report.id} className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs text-slate-500">{report.identifier}</p>
                <p className="font-semibold text-slate-900">{report.title}</p>
                <p className="text-sm text-slate-500">{report.category_label} · {formatDate(report.updated_at)}</p>
              </div>
              <StatusBadge status={report.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
