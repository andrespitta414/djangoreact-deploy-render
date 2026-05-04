import { statusOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@/lib/types";

const styles: Record<ReportStatus, string> = {
  pending: "bg-amber-100 text-amber-700 ring-amber-200",
  in_review: "bg-[#dbeafe] text-[#1B4F72] ring-[#93c5fd]",
  resolved: "bg-green-100 text-[#145A32] ring-green-200",
  rejected: "bg-red-100 text-[#ef4444] ring-red-200",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const label = statusOptions.find((item) => item.value === status)?.label ?? status;
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", styles[status])}>
      {label}
    </span>
  );
}
