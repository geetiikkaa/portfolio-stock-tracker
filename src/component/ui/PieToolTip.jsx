import { COLORS } from "../../constants/mockData";
import { formatINR } from "../../utils/utils";

export default function PieTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  const pct = ((d.value / total) * 100).toFixed(1);
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-xl"
      style={{ background: "#0c1326", borderColor: COLORS.cardBorder }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: d.payload.color }}
        />
        <span className="text-slate-300">{d.name}</span>
      </div>
      <p className="mt-1 font-medium text-white">
        {formatINR(d.value)} <span className="text-slate-400">({pct}%)</span>
      </p>
    </div>
  );
}
