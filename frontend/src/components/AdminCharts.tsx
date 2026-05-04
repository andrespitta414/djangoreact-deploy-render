import { categoryOptions, statusOptions } from "@/lib/constants";
import type { AnalyticsSummary } from "@/lib/types";
import { Cell, Pie, PieChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const pieColors = ["#1B4F72", "#145A32", "#fbbf24", "#ef4444"];

export function AdminCharts({ analytics }: { analytics: AnalyticsSummary }) {
  const categoryData = categoryOptions.map((item) => ({
    name: item.label,
    total: analytics.by_category[item.value] ?? 0,
  }));

  const statusData = statusOptions.map((item) => ({
    name: item.label,
    value: analytics.by_status[item.value] ?? 0,
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-900">Denuncias por categoria</h3>
          <p className="text-sm text-slate-500">Distribucion institucional consolidada</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} height={72} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#1B4F72" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-900">Estados del banco</h3>
          <p className="text-sm text-slate-500">Pendientes, revision, resueltos y rechazados</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {statusData.map((item, index) => (
            <div key={item.name} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                <span className="text-slate-500">{item.name}</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
