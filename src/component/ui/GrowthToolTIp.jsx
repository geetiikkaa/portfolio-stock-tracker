import { COLORS } from "../../constants/mockData";
import { formatPct } from "../../utils/utils";

export default function GrowthTooltip({ active, payload, label, visible }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-xl"
      style={{ background: "#0c1326", borderColor: COLORS.cardBorder }}
    >
      <p className="mb-1.5 text-[11px] text-slate-400">{label}</p>
      {visible.portfolio && (
        <div className="flex items-center gap-2 py-0.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: COLORS.purple }}
          />
          <span className="text-slate-300">Your Portfolio</span>
          <span
            className="ml-auto pl-3 font-medium"
            style={{ color: COLORS.purple }}
          >
            {formatPct(payload[0]?.payload?.portfolio ?? 0)}
          </span>
        </div>
      )}
      {visible.nifty && (
        <div className="flex items-center gap-2 py-0.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: COLORS.green }}
          />
          <span className="text-slate-300">NIFTY 50</span>
          <span
            className="ml-auto pl-3 font-medium"
            style={{ color: COLORS.green }}
          >
            {formatPct(payload[0]?.payload?.nifty ?? 0)}
          </span>
        </div>
      )}
    </div>
  );
}
