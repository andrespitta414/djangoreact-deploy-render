import { StatusBadge } from "@/components/StatusBadge";
import { useReports } from "@/hooks/useReports";
import { formatDate } from "@/lib/utils";

export function CitizenTrackingPage() {
  const { reports, loading } = useReports();

  return (
    <div className="mx-auto max-w-[1120px] space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeBlue">Mis seguimientos</p>
          <h3 className="text-2xl font-semibold text-slate-950">Timeline detallado de denuncias enviadas</h3>
          <p className="text-sm text-slate-500">Consulta estado, hitos de revision y trazabilidad de cada reporte.</p>
        </div>
        <div className="space-y-5">
          {(loading ? [] : reports).map((report) => (
            <article key={report.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-mono text-sm text-slate-500">{report.identifier}</div>
                  <h4 className="mt-1 text-xl font-semibold text-slate-900">{report.title || report.category_label}</h4>
                  <p className="mt-2 max-w-3xl text-sm text-slate-600">{report.what_happened}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ficha tecnica</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600">
                    <div><span className="font-semibold text-slate-900">Categoria:</span> {report.category_label}</div>
                    <div><span className="font-semibold text-slate-900">Fecha reportada:</span> {formatDate(report.created_at)}</div>
                    <div className="font-mono"><span className="font-sans font-semibold text-slate-900">Coordenadas:</span> {report.latitude}, {report.longitude}</div>
                    <div><span className="font-semibold text-slate-900">Anonima:</span> {report.is_anonymous ? "Si" : "No"}</div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                  <div className="mt-4 space-y-4">
                    {report.status_logs.map((log) => (
                      <div key={log.id} className="relative pl-6">
                        <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-ocdeGreen" />
                        <p className="text-sm font-semibold text-slate-900">{log.status_label}</p>
                        <p className="text-sm text-slate-500">{log.note}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(log.created_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
