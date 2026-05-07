import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { Modal } from "@/components/Modal";
import { ReportForm } from "@/components/ReportForm";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryOptions, statusOptions } from "@/lib/constants";
import { useReports } from "@/hooks/useReports";
import { formatDate } from "@/lib/utils";
import type { Report } from "@/lib/types";

export function AdminReportsBankPage() {
  const { reports, submitCreate, submitDelete, submitUpdate } = useReports();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modal, setModal] = useState<"create" | "view" | "edit" | "delete" | null>(null);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesQuery =
          report.identifier.toLowerCase().includes(query.toLowerCase()) ||
          report.title.toLowerCase().includes(query.toLowerCase()) ||
          report.what_happened.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || report.status === status;
        const matchesCategory = category === "all" || report.category === category;
        return matchesQuery && matchesStatus && matchesCategory;
      }),
    [reports, query, status, category]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeBlue">Banco de denuncias</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-950">Tabla tecnica y CRUD central</h3>
          </div>
          <button
            type="button"
            onClick={() => setModal("create")}
            className="inline-flex items-center gap-2 rounded-full bg-ocdeBlue px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Crear denuncia
          </button>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Buscar por ID, titulo o descripcion"
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="all">Todos los estados</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="all">Todas las categorias</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.15em] text-slate-300">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Categoria</th>
                  <th className="px-4 py-4">Fecha</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-4 py-4">Coordenadas</th>
                  <th className="px-4 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-t border-slate-200 text-sm text-slate-600">
                    <td className="px-4 py-4 font-mono text-slate-900">{report.identifier}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{report.category_label}</p>
                        <p className="truncate text-xs text-slate-500">{report.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatDate(report.created_at)}</td>
                    <td className="px-4 py-4"><StatusBadge status={report.status} /></td>
                    <td className="px-4 py-4 font-mono text-xs">{report.latitude}, {report.longitude}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setSelectedReport(report); setModal("view"); }} className="rounded-full border border-slate-200 p-2"><Eye size={16} /></button>
                        <button type="button" onClick={() => { setSelectedReport(report); setModal("edit"); }} className="rounded-full border border-slate-200 p-2"><Pencil size={16} /></button>
                        <button type="button" onClick={() => { setSelectedReport(report); setModal("delete"); }} className="rounded-full border border-red-200 p-2 text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        open={modal === "create"}
        onClose={() => setModal(null)}
        title="Crear denuncia"
        subtitle="Operacion CRUD central"
        size="xl"
        scrollable
      >
        <ReportForm
          mode="admin"
          density="compact"
          submitLabel="Crear registro"
          onSubmit={async (values, files) => {
            const success = await submitCreate(values, files);
            if (success) {
              setModal(null);
            }
          }}
        />
      </Modal>

      <Modal
        open={modal === "edit" && Boolean(selectedReport)}
        onClose={() => setModal(null)}
        title="Editar denuncia"
        subtitle={selectedReport?.identifier}
        size="lg"
        scrollable
      >
        {selectedReport ? (
          <ReportForm
            mode="admin"
            density="compact"
            initialValues={{
              title: selectedReport.title,
              category: selectedReport.category,
              other_category: selectedReport.other_category,
              what_happened: selectedReport.what_happened,
              when_happened: selectedReport.when_happened,
              details: selectedReport.details,
              latitude: selectedReport.latitude ?? "",
              longitude: selectedReport.longitude ?? "",
              status: selectedReport.status,
              is_anonymous: selectedReport.is_anonymous,
            }}
            submitLabel="Guardar cambios"
            onSubmit={async (values, files) => {
              const success = await submitUpdate(selectedReport.id, values, files);
              if (success) {
                setModal(null);
              }
            }}
          />
        ) : null}
      </Modal>

      <Modal open={modal === "view" && Boolean(selectedReport)} onClose={() => setModal(null)} title="Detalle tecnico" subtitle={selectedReport?.identifier}>
        {selectedReport ? (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Descripcion</p>
                <h4 className="mt-2 text-xl font-semibold text-slate-900">{selectedReport.title}</h4>
                <p className="mt-3 text-sm text-slate-600">{selectedReport.what_happened}</p>
                <p className="mt-3 text-sm text-slate-500">{selectedReport.details}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Meta</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="font-mono">{selectedReport.identifier}</div>
                  <div>{selectedReport.category_label}</div>
                  <div>{selectedReport.when_happened}</div>
                  <div className="font-mono">{selectedReport.latitude}, {selectedReport.longitude}</div>
                  <div><StatusBadge status={selectedReport.status} /></div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Evidencia</p>
              <div className="mt-4">
                <EvidenceGallery assets={selectedReport.images} />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={modal === "delete" && Boolean(selectedReport)} onClose={() => setModal(null)} title="Eliminar denuncia" subtitle={selectedReport?.identifier} size="md">
        {selectedReport ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Esta accion eliminara el registro del banco central. Verifica que no sea un caso en proceso.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const success = await submitDelete(selectedReport.id);
                  if (success) {
                    setModal(null);
                  }
                }}
                className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
