import axios from "axios";
import type { AnalyticsSummary, Report, ReportFormValues } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api/v1";

const api = axios.create({
  baseURL: apiBaseUrl,
});

function toFormData(values: Partial<ReportFormValues>, files: File[]) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    formData.append(key, String(value));
  });
  files.forEach((file) => formData.append("uploaded_files", file));
  return formData;
}

export async function fetchReports() {
  const { data } = await api.get<Report[]>("/reports/");
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get<AnalyticsSummary>("/reports/analytics/");
  return data;
}

export async function createReport(values: ReportFormValues, files: File[]) {
  const { data } = await api.post<Report>("/reports/", toFormData(values, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateReport(id: number, values: Partial<ReportFormValues>, files: File[]) {
  const { data } = await api.patch<Report>(`/reports/${id}/`, toFormData(values, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteReport(id: number) {
  await api.delete(`/reports/${id}/`);
}
