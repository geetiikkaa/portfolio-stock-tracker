import { LogOut, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "../constants/mockData.js";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Import useLocation

export default function PortfolioSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <aside className="w-60 h-screen sticky top-0 shrink-0 border-r border-white/10 bg-[#0d0d18] flex flex-col py-6 px-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Sparkles size={20} className="text-[#9d7bff]" />
          <span className="font-semibold text-lg text-white">Wealthora</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;

            return (
              <button
                onClick={() => navigate(path)}
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-gradient-to-r from-[#5b6cff]/30 to-[#b14ef5]/30 text-white border border-[#7c5cff]/40"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition"
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>
    </>
  );
}
