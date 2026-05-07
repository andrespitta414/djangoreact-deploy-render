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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:p-4">
      <div
        className={cn(
          "my-3 w-full max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl bg-white p-4 shadow-panel sm:my-4 sm:max-w-[calc(100vw-2rem)] md:p-6",
          size === "md" && "md:max-w-2xl",
          size === "lg" && "md:max-w-4xl",
          size === "xl" && "md:max-w-5xl"
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
        <div className={cn("max-h-[calc(100vh-8rem)] overflow-y-auto pr-1", scrollable && "md:max-h-[calc(100vh-9rem)]")}>{children}</div>
      </div>
    </div>
  );
}
