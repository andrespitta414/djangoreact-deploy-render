import { BarChart3, FilePlus2, Files, Flame, LayoutDashboard, Map, UserRound } from "lucide-react";
import type { NavItem, ReportCategory, ReportStatus } from "./types";

export const categoryOptions: Array<{ value: ReportCategory; label: string }> = [
  { value: "air_pollution", label: "Contaminacion del aire" },
  { value: "water_pollution", label: "Contaminacion del agua" },
  { value: "waste_dumping", label: "Vertimiento de residuos" },
  { value: "deforestation", label: "Deforestacion" },
  { value: "wildlife_trafficking", label: "Afectacion de fauna" },
  { value: "noise_pollution", label: "Contaminacion auditiva" },
  { value: "other", label: "Otro" },
];

export const statusOptions: Array<{ value: ReportStatus; label: string }> = [
  { value: "pending", label: "Pendiente" },
  { value: "in_review", label: "En revision" },
  { value: "resolved", label: "Resuelto" },
  { value: "rejected", label: "Rechazado" },
];

export const citizenNav: NavItem[] = [
  { label: "Nueva denuncia", path: "/citizen/new-report", module: "citizen" },
  { label: "Mis seguimientos", path: "/citizen/tracking", module: "citizen" },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", module: "admin" },
  { label: "Banco", path: "/admin/reports", module: "admin" },
  { label: "Mapas", path: "/admin/heatmaps", module: "admin" },
  { label: "Analitica", path: "/admin/analytics", module: "admin" },
  { label: "Usuarios", path: "/admin/users", module: "admin" },
];

export const navIcons = {
  "/citizen/new-report": FilePlus2,
  "/citizen/tracking": Files,
  "/admin/dashboard": LayoutDashboard,
  "/admin/reports": Files,
  "/admin/heatmaps": Map,
  "/admin/analytics": BarChart3,
  "/admin/users": UserRound,
  default: Flame,
};
