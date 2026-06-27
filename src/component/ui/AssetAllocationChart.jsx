import Card from "./Card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Sector,
  Cell,
} from "recharts";
import { ALLOCATION } from "../../constants/mockData";
import { formatINR } from "../../utils/utils";
import PieTooltip from "./PieToolTip";
import { useMemo, useState } from "react";

function renderActiveSlice(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={6}
    />
  );
}

export default function AssetAllocationChart() {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const allocationTotal = useMemo(
    () => ALLOCATION.reduce((sum, a) => sum + a.value, 0),
    [],
  );

  return (
    <>
      <Card className={"flex flex-col justify-center"}>
        <h2 className="mb-2 text-[15px] font-semibold text-white">
          Asset Allocation
        </h2>
        <div className="flex items-center">
          <div className="relative h-44 w-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={78}
                  paddingAngle={3}
                  cornerRadius={6}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive={false}
                  activeIndex={hoveredSlice}
                  activeShape={renderActiveSlice}
                  onMouseEnter={(_, idx) => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  {ALLOCATION.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<PieTooltip total={allocationTotal} />}
                  wrapperStyle={{ zIndex: 50 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-white">
                {formatINR(allocationTotal)}
              </span>
              <span className="text-[11px] text-slate-400">Total</span>
            </div>
          </div>

          <div className="ml-2 flex flex-1 flex-col gap-3">
            {ALLOCATION.map((entry, idx) => (
              <button
                key={entry.name}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
                className="flex items-center gap-2 text-left transition-opacity"
                style={{
                  opacity:
                    hoveredSlice === null || hoveredSlice === idx ? 1 : 0.45,
                }}
              >
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-[13px] text-slate-300">{entry.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
      ;
    </>
  );
}
