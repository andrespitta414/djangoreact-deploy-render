import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AdminAnalyticsPage } from "@/pages/AdminAnalyticsPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AdminHeatmapsPage } from "@/pages/AdminHeatmapsPage";
import { AdminReportsBankPage } from "@/pages/AdminReportsBankPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { CitizenNewReportPage } from "@/pages/CitizenNewReportPage";
import { CitizenTrackingPage } from "@/pages/CitizenTrackingPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/new-report" replace />} />
        <Route path="/new-report" element={<CitizenNewReportPage />} />
        <Route path="/tracking" element={<CitizenTrackingPage />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/citizen/new-report" element={<Navigate to="/new-report" replace />} />
        <Route path="/citizen/tracking" element={<Navigate to="/tracking" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/reports" element={<AdminReportsBankPage />} />
        <Route path="/admin/heatmaps" element={<AdminHeatmapsPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<Navigate to="/new-report" replace />} />
      </Routes>
    </AppShell>
  );
}
