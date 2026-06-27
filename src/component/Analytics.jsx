import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import PortfolioSidebar from "./PortfolioSidebar";
import {
  RANGE_OPTIONS,
  COLORS,
  MONTHLY_RETURNS,
  ALLOCATION,
  C,
} from "../constants/mockData";
import Card from "./ui/Card";
import PieTooltip from "./ui/PieToolTip";
import { formatINR } from "../utils/utils";
import BarReturnTooltip from "./ui/BarReturnToolTip";
import { formatPct } from "../utils/utils";
import PortfolioGrowthCard from "./ui/PortfolioGrowthCard";

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

export default function Analytics() {
  const [range, setRange] = useState("1Y");
  const [visibleSeries, setVisibleSeries] = useState({
    portfolio: true,
    nifty: true,
  });
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const metrics = useMemo(() => {
    const values = MONTHLY_RETURNS.map((m) => m.value);
    const best = MONTHLY_RETURNS.reduce((a, b) => (b.value > a.value ? b : a));
    const worst = MONTHLY_RETURNS.reduce((a, b) => (b.value < a.value ? b : a));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const positiveCount = values.filter((v) => v > 0).length;
    return { best, worst, avg, positiveCount, total: values.length };
  }, []);
  const allocationTotal = useMemo(
    () => ALLOCATION.reduce((sum, a) => sum + a.value, 0),
    [],
  );
  const toggleSeries = (key) =>
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className="flex min-h-screen w-full font-sans text-white"
      style={{
        background:
          "radial-gradient(120% 120% at 10% 0%, #0b1126 0%, #070b14 55%, #05070d 100%)",
      }}
    >
      <PortfolioSidebar />
      <div className="max-w-[1400px] w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analytics
          </h1>
          <div className="flex gap-4">
            <div
              className="flex items-center gap-1 rounded-xl border p-1"
              style={{
                borderColor: COLORS.cardBorder,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {RANGE_OPTIONS.map((opt) => {
                const active = opt === range;
                return (
                  <button
                    key={opt}
                    onClick={() => setRange(opt)}
                    className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "text-white shadow-lg shadow-indigo-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg, #6d5bf0, #8b5cf6)",
                          }
                        : undefined
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                color: "#fff",
              }}
            >
              G
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left column */}
          {/* Portfolio Growth */}
          <PortfolioGrowthCard
            range={range}
            visibleSeries={visibleSeries}
            toggleSeries={toggleSeries}
          />

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
                    <Tooltip content={<PieTooltip total={allocationTotal} />} />
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
                        hoveredSlice === null || hoveredSlice === idx
                          ? 1
                          : 0.45,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="text-[13px] text-slate-300">
                      {entry.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className={"lg:col-span-2 h-[290px]"}>
            <h2 className="mb-4 text-[15px] font-semibold text-white">
              Monthly Returns
            </h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MONTHLY_RETURNS}
                  margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke={COLORS.grid}
                    vertical={false}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.axisText, fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.axisText, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    width={42}
                  />
                  <Tooltip
                    content={<BarReturnTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 4, 4]}
                    isAnimationActive={false}
                  >
                    {MONTHLY_RETURNS.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.value >= 0 ? COLORS.purple : COLORS.green}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <h2 className="mb-1 text-[15px] font-semibold text-white">
              Performance Metrics
            </h2>
            <div>
              <Row
                label="Best Month"
                value={formatPct(metrics.best.value)}
                tone="green"
              />
              <Row
                label="Worst Month"
                value={formatPct(metrics.worst.value)}
                tone="red"
              />
              <Row
                label="Average Monthly Return"
                value={formatPct(metrics.avg)}
                tone={metrics.avg >= 0 ? "green" : "red"}
              />
              <Row
                label="Positive Months"
                value={`${metrics.positiveCount}/${metrics.total}`}
                tone="white"
                last
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone, last = false }) {
  const toneColor =
    tone === "green" ? COLORS.green : tone === "red" ? COLORS.red : "#ffffff";
  return (
    <div
      className={`flex items-center justify-between py-3 ${last ? "" : "border-b"}`}
      style={{ borderColor: COLORS.cardBorder }}
    >
      <span className="text-[13px] text-slate-400">{label}</span>
      <span className="text-sm font-semibold" style={{ color: toneColor }}>
        {value}
      </span>
    </div>
  );
}
