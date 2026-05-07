import { AdminCharts } from "@/components/AdminCharts";
import { useReports } from "@/hooks/useReports";
import { downloadCsv } from "@/lib/utils";

export function AdminAnalyticsPage() {
  const { analytics, reports } = useReports();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeGreen">Reportes analiticos</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-950">Resumen estadistico, filtros y exportacion</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                "reportes-ambientales.csv",
                [
                  ["ID", "Nombre del caso", "Categoria", "Estado", "Latitud", "Longitud", "Anonima", "Fecha"],
                  ...reports.map((report) => [
                    report.identifier,
                    report.title || report.category_label,
                    report.category_label,
                    report.status_label,
                    report.latitude ?? "",
                    report.longitude ?? "",
                    report.is_anonymous ? "Si" : "No",
                    report.created_at,
                  ]),
                ]
              )
            }
            className="rounded-full bg-ocdeGreen px-5 py-3 text-sm font-semibold text-white"
          >
            Exportar CSV
          </button>
        </div>
      </section>
      <AdminCharts analytics={analytics} />
    </div>
  );
}
