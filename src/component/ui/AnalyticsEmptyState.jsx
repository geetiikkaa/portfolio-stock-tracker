import { Clock3, ChartNoAxesCombined } from "lucide-react";

export default function AnalyticsEmptyState({
  title = "Historical performance isn't available yet",
  description = "Your portfolio performance will appear here once historical data becomes available.",
}) {
  return (
    <div className="flex min-h-[220px] h-full flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
        <ChartNoAxesCombined
          size={23}
          strokeWidth={1.8}
          className="text-indigo-400"
        />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>

      <p className="max-w-sm text-xs leading-5 text-slate-400">{description}</p>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Clock3 size={13} />
        <span>Waiting for historical data</span>
      </div>
    </div>
  );
}
