import { cardStyle } from "../../constants/mockData";
import Sparkline from "./Sparkline";
import { ArrowUpRight } from "lucide-react";
import { C } from "../../constants/mockData";

export default function StatCard({
  label,
  value,
  sub,
  subColor,
  spark: data,
  sparkColor,
  right,
}) {
  return (
    <div style={cardStyle} className="p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs" style={{ color: C.muted }}>
            {label}
          </div>
          <div className="text-2xl font-bold mt-2" style={{ color: C.text }}>
            {value}
          </div>
        </div>
        {data && <Sparkline data={data} color={sparkColor} />}
        {right}
      </div>
      {sub && (
        <div
          className="flex items-center gap-1 mt-3 text-sm font-medium"
          style={{ color: subColor }}
        >
          <ArrowUpRight size={15} strokeWidth={2.5} />
          {sub}
        </div>
      )}
    </div>
  );
}
