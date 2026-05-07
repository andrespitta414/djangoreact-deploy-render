import { useLocation, useNavigate } from "react-router-dom";

export function SelectorPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === "/dashboard" || location.pathname.startsWith("/admin");

  return (
    <div className="grid w-full grid-cols-2 overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => navigate("/new-report")}
        className={`min-w-0 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${!isAdmin ? "bg-ocdeGreen text-white" : "text-slate-600"}`}
      >
        Ciudadania
      </button>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className={`min-w-0 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${isAdmin ? "bg-ocdeBlue text-white" : "text-slate-600"}`}
      >
        Admin
      </button>
    </div>
  );
}
