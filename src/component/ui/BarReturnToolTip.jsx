import { COLORS } from "../../constants/mockData";
import { formatPct } from "../../utils/utils";

export default function BarReturnTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { month, value } = payload[0].payload;
  const positive = value >= 0;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-xl"
      style={{ background: "#0c1326", borderColor: COLORS.cardBorder }}
    >
      <p className="mb-1 text-[11px] text-slate-400">{month}</p>
      <span
        className="font-medium"
        style={{ color: positive ? COLORS.purple : COLORS.green }}
      >
        {formatPct(value)}
      </span>
    </div>
  );
}
