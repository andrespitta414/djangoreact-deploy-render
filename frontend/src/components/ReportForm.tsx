import { Controller, useForm } from "react-hook-form";
import { categoryOptions, statusOptions } from "@/lib/constants";
import { FileUploadZone } from "./FileUploadZone";
import { MapPicker } from "./MapPicker";
import type { ReportFormValues } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReportFormProps {
  mode?: "citizen" | "admin";
  density?: "default" | "compact";
  initialValues?: Partial<ReportFormValues>;
  onSubmit: (values: ReportFormValues, files: File[]) => Promise<void> | void;
  submitLabel: string;
}

const defaultValues: ReportFormValues = {
  title: "",
  category: "waste_dumping",
  other_category: "",
  what_happened: "",
  when_happened: "",
  details: "",
  latitude: "4.711000",
  longitude: "-74.072100",
  status: "pending",
  is_anonymous: false,
};

export function ReportForm({
  mode = "citizen",
  density = "default",
  initialValues,
  onSubmit,
  submitLabel,
}: ReportFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<ReportFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  useEffect(() => {
    reset({ ...defaultValues, ...initialValues });
  }, [initialValues, reset]);

  const category = watch("category");
  const compact = density === "compact";

  return (
    <form
      className={compact ? "space-y-4" : "space-y-6"}
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values, files);
      })}
    >
      <section className={cn("grid gap-4", compact ? "xl:grid-cols-2" : "xl:grid-cols-3")}>
        <div className={cn("rounded-3xl border border-slate-200 bg-slate-50", compact ? "p-4" : "p-4 md:p-5")}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeBlue">Pregunta 1</p>
          <label className="mt-3 block text-sm font-medium text-slate-700">Que ocurrio</label>
          <textarea
            {...register("what_happened", { required: true })}
            rows={compact ? 2 : 3}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 focus:border-ocdeBlue"
            placeholder="Describe el hecho principal de la denuncia"
          />
          <label className="mt-4 block text-sm font-medium text-slate-700">Titulo tecnico</label>
          <input
            {...register("title")}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-ocdeBlue"
            placeholder="Resumen corto para identificar el caso"
          />
        </div>
        <div className={cn("rounded-3xl border border-slate-200 bg-slate-50", compact ? "p-4" : "p-4 md:p-5")}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeGreen">Pregunta 2</p>
          <label className="mt-3 block text-sm font-medium text-slate-700">Cuando ocurrio</label>
          <textarea
            {...register("when_happened", { required: true })}
            rows={compact ? 2 : 3}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-ocdeGreen"
            placeholder="Fecha, hora o periodo en el que observaste el hecho"
          />
          <label className="mt-4 block text-sm font-medium text-slate-700">Categoria ambiental</label>
          <select {...register("category")} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none">
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {category === "other" ? (
            <>
              <label className="mt-4 block text-sm font-medium text-slate-700">Especifica la categoria</label>
              <input
                {...register("other_category", { required: true })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-ocdeBlue"
                placeholder="Describe la categoria ambiental"
              />
            </>
          ) : null}
        </div>
        <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", compact ? "p-4 xl:col-span-2" : "p-4 md:p-5")}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pregunta 3</p>
          <label className="mt-3 block text-sm font-medium text-slate-700">Detalles complementarios</label>
          <textarea
            {...register("details")}
            rows={compact ? 4 : 6}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-ocdeBlue"
            placeholder="Incluye actores involucrados, impactos, referencias visibles o cualquier otra evidencia contextual"
          />
        </div>
      </section>

      <section className={cn("grid gap-4", compact ? "xl:grid-cols-[minmax(0,1fr)_270px]" : "xl:grid-cols-[minmax(0,1fr)_300px]")}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Ubicacion georreferenciada</h3>
              <p className="text-sm text-slate-500">Selecciona el punto en el mapa para capturar GPS</p>
            </div>
            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700">
              {watch("latitude")}, {watch("longitude")}
            </div>
          </div>
          <Controller
            control={control}
            name="latitude"
            render={() => (
              <MapPicker
                latitude={Number(watch("latitude"))}
                longitude={Number(watch("longitude"))}
                onChange={({ latitude, longitude }) => {
                  setValue("latitude", latitude.toFixed(6));
                  setValue("longitude", longitude.toFixed(6));
                }}
              />
            )}
          />
        </div>
        <div className={cn("space-y-4", !compact && "xl:sticky xl:top-28 xl:self-start")}>
          <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", compact ? "p-4" : "p-4 md:p-5")}>
            <h3 className="text-lg font-semibold text-slate-900">Evidencia multimedia</h3>
            <p className="mt-1 text-sm text-slate-500">Adjunta fotografias, videos o soportes del caso.</p>
            <div className="mt-4">
              <FileUploadZone files={files} onChange={setFiles} />
            </div>
          </div>
          <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", compact ? "p-4" : "p-4 md:p-5")}>
            <h3 className="text-lg font-semibold text-slate-900">Privacidad y flujo</h3>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" {...register("is_anonymous")} className="h-4 w-4 rounded border-slate-300 text-ocdeGreen" />
              Enviar denuncia de forma anonima
            </label>
            {mode === "admin" ? (
              <>
                <label className="mt-4 block text-sm font-medium text-slate-700">Estado administrativo</label>
                <select {...register("status")} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <div className={cn(
        "relative z-10 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between",
        compact ? "md:sticky md:bottom-0" : "md:sticky md:bottom-4"
      )}>
        <p className="text-sm text-slate-500">Formulario optimizado para una captura mas corta, clara y facil de revisar.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-ocdeBlue px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Procesando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
