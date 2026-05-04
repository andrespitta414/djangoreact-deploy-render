export type ReportStatus = "pending" | "in_review" | "resolved" | "rejected";
export type ReportCategory =
  | "air_pollution"
  | "water_pollution"
  | "waste_dumping"
  | "deforestation"
  | "wildlife_trafficking"
  | "noise_pollution"
  | "other";

export interface ReportAsset {
  id: number;
  file: string;
  uploaded_at: string;
}

export interface ReportLog {
  id: number;
  status: ReportStatus;
  status_label: string;
  note: string;
  created_at: string;
}

export interface Report {
  id: number;
  identifier: string;
  title: string;
  description: string;
  done: boolean;
  category: ReportCategory;
  category_label: string;
  other_category: string;
  what_happened: string;
  when_happened: string;
  details: string;
  latitude: string | null;
  longitude: string | null;
  status: ReportStatus;
  status_label: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  images: ReportAsset[];
  status_logs: ReportLog[];
}

export interface AnalyticsSummary {
  total_reports: number;
  anonymous_reports: number;
  resolved_reports: number;
  pending_reports: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  recent_reports: Report[];
}

export interface ReportFormValues {
  title: string;
  category: ReportCategory;
  other_category: string;
  what_happened: string;
  when_happened: string;
  details: string;
  latitude: string;
  longitude: string;
  status: ReportStatus;
  is_anonymous: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  module: "citizen" | "admin";
}
