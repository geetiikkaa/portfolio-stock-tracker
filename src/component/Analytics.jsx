import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
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

/* ----------------------------------------------------------------------- */
/*  Design tokens (sampled from the reference UI)                          */
/* ----------------------------------------------------------------------- */

const COLORS = {
  pageBg: "#070b14",
  card: "#0b1020",
  cardBorder: "#1b2236",
  grid: "#1a2236",
  axisText: "#5b6478",
  purple: "#7c6ef6", // "Your Portfolio" line / active pill / equity
  purpleSoft: "#4c46b8",
  green: "#34d399", // "NIFTY 50" line / positive metrics
  red: "#f87171", // negative metrics
  orange: "#f97316", // crypto slice
  violet: "#a855f7", // mutual funds slice
  gray: "#94a3b8", // cash slice
};

const RANGE_OPTIONS = ["1M", "3M", "6M", "1Y", "All"];
const RANGE_DAYS = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365, All: 730 };

/* ----------------------------------------------------------------------- */
/*  Deterministic synthetic data generation                                */
/* ----------------------------------------------------------------------- */

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateGrowthSeries(totalDays) {
  const rand = seededRandom(7321);
  const today = new Date();
  const dayMs = 86400000;

  let portfolioRaw = 0;
  let niftyRaw = 0;
  const raw = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    portfolioRaw += 0.137 + (rand() - 0.5) * 1.6;
    niftyRaw += 0.071 + (rand() - 0.5) * 1.3;
    raw.push({
      date: new Date(today.getTime() - i * dayMs),
      portfolio: portfolioRaw,
      nifty: niftyRaw,
    });
  }

  // Anchor so that exactly one year back from today reads ~ -12% / -8%,
  // matching the reference chart's starting point for the 1Y view.
  const anchorIdx = Math.max(0, raw.length - 365);
  const shiftP = -12 - raw[anchorIdx].portfolio;
  const shiftN = -8 - raw[anchorIdx].nifty;

  return raw.map((d) => ({
    ...d,
    portfolio: Math.round((d.portfolio + shiftP) * 10) / 10,
    nifty: Math.round((d.nifty + shiftN) * 10) / 10,
  }));
}

function formatTick(date, range) {
  if (range === "1M") {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  }
  if (range === "All") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  }
  return date.toLocaleDateString("en-US", { month: "short" });
}

const MONTHLY_RETURNS = [
  { month: "Jul", value: 5.6 },
  { month: "Aug", value: 1.4 },
  { month: "Sep", value: -2.8 },
  { month: "Oct", value: 6.9 },
  { month: "Nov", value: -1.6 },
  { month: "Dec", value: 2.2 },
  { month: "Jan", value: -4.35 },
  { month: "Feb", value: 3.1 },
  { month: "Mar", value: 8.25 },
  { month: "Apr", value: 2.4 },
  { month: "May", value: -1.1 },
  { month: "Jun", value: 1.8 },
];

const ALLOCATION = [
  { name: "Equity", value: 1361490, color: COLORS.purple },
  { name: "Mutual Funds", value: 495085, color: COLORS.violet },
  { name: "Crypto", value: 371315, color: COLORS.orange },
  { name: "Cash", value: 247540, color: COLORS.gray },
];

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatPct = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

/* ----------------------------------------------------------------------- */
/*  Small shared UI pieces                                                 */
/* ----------------------------------------------------------------------- */

function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border bg-[${COLORS.card}] p-5 ${className}`}
      style={{ background: COLORS.card, borderColor: COLORS.cardBorder }}
    >
      {children}
    </div>
  );
}

function GrowthTooltip({ active, payload, label, visible }) {
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

function BarReturnTooltip({ active, payload }) {
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

function PieTooltip({ active, payload, total }) {
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

/* ----------------------------------------------------------------------- */
/*  Main component                                                         */
/* ----------------------------------------------------------------------- */

export default function Analytics() {
  const [range, setRange] = useState("1Y");
  const [visibleSeries, setVisibleSeries] = useState({
    portfolio: true,
    nifty: true,
  });
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const fullSeries = useMemo(() => generateGrowthSeries(RANGE_DAYS.All), []);

  const growthData = useMemo(() => {
    const days = RANGE_DAYS[range];
    return fullSeries.slice(-days).map((d) => ({
      ...d,
      label: formatTick(d.date, range),
    }));
  }, [fullSeries, range]);

  const tickInterval = Math.max(0, Math.ceil(growthData.length / 7) - 1);

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
      className="min-h-screen w-full font-sans text-white"
      style={{
        background:
          "radial-gradient(120% 120% at 10% 0%, #0b1126 0%, #070b14 55%, #05070d 100%)",
      }}
    >
      <div className="mx-auto max-w-[1400px] p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analytics
          </h1>

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
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Portfolio Growth */}
            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold text-white">
                  Portfolio Growth
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleSeries("portfolio")}
                    className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
                    style={{ opacity: visibleSeries.portfolio ? 1 : 0.4 }}
                  >
                    <span
                      className="h-[3px] w-4 rounded-full"
                      style={{ background: COLORS.purple }}
                    />
                    <span className="text-slate-300">Your Portfolio</span>
                  </button>
                  <button
                    onClick={() => toggleSeries("nifty")}
                    className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
                    style={{ opacity: visibleSeries.nifty ? 1 : 0.4 }}
                  >
                    <span
                      className="h-[3px] w-4 rounded-full"
                      style={{ background: COLORS.green }}
                    />
                    <span className="text-slate-300">NIFTY 50</span>
                  </button>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={growthData}
                    margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="portfolioFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.purple}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.purple}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="niftyFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.green}
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.green}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke={COLORS.grid}
                      vertical={false}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="label"
                      interval={tickInterval}
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
                      content={<GrowthTooltip visible={visibleSeries} />}
                      cursor={{ stroke: COLORS.grid }}
                    />
                    {visibleSeries.portfolio && (
                      <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="none"
                        fill="url(#portfolioFill)"
                        isAnimationActive={false}
                      />
                    )}
                    {visibleSeries.nifty && (
                      <Area
                        type="monotone"
                        dataKey="nifty"
                        stroke="none"
                        fill="url(#niftyFill)"
                        isAnimationActive={false}
                      />
                    )}
                    {visibleSeries.portfolio && (
                      <Line
                        type="monotone"
                        dataKey="portfolio"
                        stroke={COLORS.purple}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: COLORS.purple }}
                        isAnimationActive={false}
                        style={{
                          filter:
                            "drop-shadow(0px 0px 6px rgba(124,110,246,0.55))",
                        }}
                      />
                    )}
                    {visibleSeries.nifty && (
                      <Line
                        type="monotone"
                        dataKey="nifty"
                        stroke={COLORS.green}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: COLORS.green }}
                        isAnimationActive={false}
                        style={{
                          filter:
                            "drop-shadow(0px 0px 6px rgba(52,211,153,0.45))",
                        }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Monthly Returns */}
            <Card>
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
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Asset Allocation */}
            <Card>
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
