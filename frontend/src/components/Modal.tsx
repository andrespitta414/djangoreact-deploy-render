import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  scrollable?: boolean;
}

export function Modal({ title, subtitle, open, onClose, children, size = "lg", scrollable = false }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div
        className={cn(
          "w-full rounded-3xl bg-white p-5 shadow-panel md:p-6",
          size === "md" && "max-w-2xl",
          size === "lg" && "max-w-4xl",
          size === "xl" && "max-w-6xl",
          scrollable && "max-h-[88vh] overflow-hidden"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className={cn(scrollable && "max-h-[calc(88vh-92px)] overflow-y-auto pr-1")}>{children}</div>
      </div>
    </div>
  );
}
