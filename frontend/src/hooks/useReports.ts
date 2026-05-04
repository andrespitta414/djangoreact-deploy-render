import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createReport, deleteReport, fetchAnalytics, fetchReports, updateReport } from "@/lib/api";
import { mockAnalytics, mockReports } from "@/lib/mockData";
import type { AnalyticsSummary, Report, ReportFormValues } from "@/lib/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(mockAnalytics);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsResponse, analyticsResponse] = await Promise.all([fetchReports(), fetchAnalytics()]);
      setReports(reportsResponse);
      setAnalytics(analyticsResponse);
      setUsingFallback(false);
    } catch {
      setReports(mockReports);
      setAnalytics(mockAnalytics);
      if (!usingFallback) {
        toast.error("Backend no disponible. Se muestran datos demo mientras restableces Django.");
      }
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const submitCreate = async (values: ReportFormValues, files: File[]) => {
    try {
      const report = await createReport(values, files);
      setReports((current) => [report, ...current]);
      toast.success("Denuncia registrada correctamente.");
      await loadData();
      return true;
    } catch {
      toast.error("No fue posible guardar en el backend. Se mantiene la vista demo.");
      return false;
    }
  };

  const submitUpdate = async (id: number, values: Partial<ReportFormValues>, files: File[]) => {
    try {
      await updateReport(id, values, files);
      toast.success("Denuncia actualizada.");
      await loadData();
      return true;
    } catch {
      toast.error("No fue posible actualizar la denuncia.");
      return false;
    }
  };

  const submitDelete = async (id: number) => {
    try {
      await deleteReport(id);
      toast.success("Denuncia eliminada.");
      await loadData();
      return true;
    } catch {
      toast.error("No fue posible eliminar la denuncia.");
      return false;
    }
  };

  return {
    reports,
    analytics,
    loading,
    loadData,
    submitCreate,
    submitUpdate,
    submitDelete,
  };
}
