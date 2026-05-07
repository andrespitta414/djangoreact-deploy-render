import { useState } from "react";
import toast from "react-hot-toast";
import { ReportForm } from "@/components/ReportForm";
import { useReports } from "@/hooks/useReports";

export function CitizenNewReportPage() {
  const [formKey, setFormKey] = useState(0);
  const { submitCreate } = useReports();

  return (
    <div className="mx-auto max-w-[1040px] space-y-4">
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocdeGreen">Paso 1</p>
          <p className="mt-2 text-sm font-medium text-slate-900">Resume el hecho en pocas lineas y luego agrega el contexto clave.</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocdeBlue">Paso 2</p>
          <p className="mt-2 text-sm font-medium text-slate-900">Marca la ubicacion exacta y adjunta evidencia solo si aporta valor.</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Resultado</p>
          <p className="mt-2 text-sm font-medium text-slate-200">El tiempo de respuesta puede tardar entre 3 y 5 dias. Consulta la pagina oficial para hacer seguimiento.</p>
        </div>
      </section>
      <section className="grid gap-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeGreen">Nueva denuncia</p>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Formulario ciudadano con GPS y evidencia</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Captura el hecho en tres preguntas, marca la ubicacion exacta y adjunta soportes visuales.
                </p>
              </div>
              <div className="inline-flex w-fit rounded-full border border-ocdeBlue/15 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ocdeBlue">
                Flujo guiado
              </div>
            </div>
          </div>
          <ReportForm
            key={formKey}
            submitLabel="Enviar denuncia"
            onSubmit={async (values, files) => {
              const success = await submitCreate(values, files);
              if (success) {
                toast.success("Tu denuncia fue enviada al banco central.");
                setFormKey((currentKey) => currentKey + 1);
              }
            }}
          />
        </div>
      </section>
    </div>
  );
}
