import Card from "./Card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Sector,
  Cell,
} from "recharts";
import { formatUSD } from "../../utils/utils";
import PieTooltip from "./PieToolTip";
import { useMemo, useState } from "react";
import { C } from "../../constants/ui";

const ALLOCATION_COLORS = [
  C.blue,
  C.purple,
  C.green,
  C.red,
  "#f59e0b",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
];

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

export default function AssetAllocationChart({ holdings = [] }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const allocation = useMemo(() => {
    const grouped = {};

    holdings.forEach((holding) => {
      const assetClass = holding.assetClass || "Other";
      const currentValue = Number(holding.currentValue) || 0;

      if (!grouped[assetClass]) {
        grouped[assetClass] = 0;
      }

      grouped[assetClass] += currentValue;
    });

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length],
    }));
  }, [holdings]);

  const allocationTotal = useMemo(
    () => allocation.reduce((sum, a) => sum + a.value, 0),
    [allocation],
  );

  return (
    <Card className="flex flex-col justify-center">
      <h2 className="mb-2 text-[15px] font-semibold text-white">
        Asset Allocation
      </h2>

      {allocation.length === 0 ? (
        <div className="flex items-center justify-center h-44 text-sm text-slate-500">
          No portfolio holdings
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative h-44 w-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
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
                  {allocation.map((entry, idx) => (
                    <Cell key={entry.name} fill={entry.color} />
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
                {formatUSD(allocationTotal)}
              </span>

              <span className="text-[11px] text-slate-400">Total</span>
            </div>
          </div>

          <div className="ml-2 flex flex-1 flex-col gap-3">
            {allocation.map((entry, idx) => (
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

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-300">
                      {entry.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
