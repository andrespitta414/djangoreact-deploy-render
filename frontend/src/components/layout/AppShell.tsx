import { ArrowLeft, Compass, Flame, LayoutGrid } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminNav, citizenNav, navIcons } from "@/lib/constants";
import { SelectorPrincipal } from "../SelectorPrincipal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const navItems = isAdmin ? adminNav : citizenNav;
  const moduleHome = isAdmin ? "/admin/dashboard" : "/citizen/new-report";
  const secondaryAction = isAdmin
    ? { label: "Banco", path: "/admin/reports", icon: LayoutGrid }
    : { label: "Seguimiento", path: "/citizen/tracking", icon: Compass };
  const sectionTitle = isAdmin ? "Centro de control ambiental" : "Recepcion y seguimiento";
  const sectionDescription = isAdmin
    ? "Vista compacta para analisis, banco y monitoreo institucional."
    : "Formulario guiado y seguimiento ciudadano con navegacion mas simple.";
  const canGoBack =
    typeof window !== "undefined" &&
    window.history.length > 1 &&
    location.pathname !== moduleHome;

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="mx-auto flex min-h-screen max-w-[1360px] gap-4 px-3 py-3 md:px-4 md:py-4">
        <aside className="hidden w-60 shrink-0 rounded-[28px] bg-slate-950 p-5 text-white shadow-panel md:flex md:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocdeBlue">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">OCDE</p>
              <h1 className="text-base font-semibold">Denuncias Ambientales</h1>
            </div>
          </div>
          <div className="mt-5">
            <SelectorPrincipal />
          </div>
          <nav className="mt-5 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = navIcons[item.path as keyof typeof navIcons] ?? navIcons.default;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Modo {isAdmin ? "administrativo" : "ciudadano"}</p>
            <p className="mt-2">Navegacion compacta con accesos directos para volver y cambiar de vista.</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-6">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="sticky top-3 z-30 mb-4 flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/95 p-4 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between md:p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Plataforma institucional</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950 md:text-xl">{sectionTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">{sectionDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end">
                <div className="md:hidden">
                  <SelectorPrincipal />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (canGoBack) {
                      navigate(-1);
                      return;
                    }
                    navigate(moduleHome);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft size={16} />
                  {canGoBack ? "Volver" : "Inicio"}
                </button>
                <Link
                  to={secondaryAction.path}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ocdeBlue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <secondaryAction.icon size={16} />
                  {secondaryAction.label}
                </Link>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-40 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-panel backdrop-blur md:hidden">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        >
          {navItems.map((item) => {
            const Icon = navIcons[item.path as keyof typeof navIcons] ?? navIcons.default;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
                  active ? "bg-slate-900 text-white" : "text-slate-500"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
