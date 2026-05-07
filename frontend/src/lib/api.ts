import axios from "axios";
import type { AnalyticsSummary, Report, ReportFormValues } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api/v1";

const api = axios.create({
  baseURL: apiBaseUrl,
});

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}

function toNumberRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, toNumber(entry)]));
}

function normalizeReport(report: unknown): Report {
  const source = isRecord(report) ? report : {};
  return {
    ...(source as Report),
    images: Array.isArray(source.images) ? (source.images as Report["images"]) : [],
    status_logs: Array.isArray(source.status_logs) ? (source.status_logs as Report["status_logs"]) : [],
  };
}

function normalizeList<T>(payload: unknown, normalizeItem: (item: unknown) => T = (item) => item as T): T[] {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeItem(item));
  }
  if (isRecord(payload) && Array.isArray(payload.results)) {
    return payload.results.map((item) => normalizeItem(item));
  }
  return [];
}

function normalizeAnalytics(payload: unknown): AnalyticsSummary {
  const summary = isRecord(payload) ? payload : {};
  return {
    total_reports: toNumber(summary.total_reports),
    anonymous_reports: toNumber(summary.anonymous_reports),
    resolved_reports: toNumber(summary.resolved_reports),
    pending_reports: toNumber(summary.pending_reports),
    by_status: toNumberRecord(summary.by_status),
    by_category: toNumberRecord(summary.by_category),
    recent_reports: normalizeList<Report>(summary.recent_reports, normalizeReport),
  };
}

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
  const { data } = await api.get<unknown>("/reports/");
  return normalizeList<Report>(data, normalizeReport);
}

export async function fetchAnalytics() {
  const { data } = await api.get<unknown>("/reports/analytics/");
  return normalizeAnalytics(data);
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
