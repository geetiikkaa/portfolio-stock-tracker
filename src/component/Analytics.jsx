import { useCallback, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import PortfolioSidebar from "./PortfolioSidebar";
import {
  MONTHLY_RETURNS,
  RANGE_OPTIONS,
} from "../constants/mockDataUnified";
import { COLORS } from "../constants/ui";
import Card from "./ui/Card";
import BarReturnTooltip from "./ui/BarReturnToolTip";
import { formatPct } from "../utils/utils";
import PortfolioGrowthCard from "./ui/PortfolioGrowthCard";
import ProfileAvatar from "./ui/ProfileAvatar";
import ProfileModal from "./ui/ProfileModal";
import AssetAllocationChart from "./ui/AssetAllocationChart";

export default function Analytics() {
  let [range, setRange] = useState("1Y");
  let [visibleSeries, setVisibleSeries] = useState({
    portfolio: true,
    nifty: true,
  });
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let best = MONTHLY_RETURNS[0];
  let worst = MONTHLY_RETURNS[0];
  let sum = 0;
  let positiveCount = 0;

  for (let m of MONTHLY_RETURNS) {
    sum += m.value;

    if (m.value > best.value) best = m;
    if (m.value < worst.value) worst = m;
    if (m.value > 0) positiveCount++;
  }

  let metrics = {
    best,
    worst,
    avg: sum / MONTHLY_RETURNS.length,
    positiveCount,
    total: MONTHLY_RETURNS.length,
  };

  let toggleSeries = useCallback(
    (key) => {
      setVisibleSeries((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [setVisibleSeries],
  );

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
      <div
        className="flex min-h-screen w-full font-sans text-white"
        style={{
          background:
            "radial-gradient(120% 120% at 10% 0%, #0b1126 0%, #070b14 55%, #05070d 100%)",
        }}
      >
        <PortfolioSidebar />
        <div className="max-w-[1400px] w-full p-6 md:p-8">
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
                  let active = opt === range;
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
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <PortfolioGrowthCard
              range={range}
              visibleSeries={visibleSeries}
              toggleSeries={toggleSeries}
            />
            <AssetAllocationChart />
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
    </>
  );
}

function Row({ label, value, tone, last = false }) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${last ? "" : "border-b"}`}
      style={{ borderColor: COLORS.cardBorder }}
    >
      <span className="text-[13px] text-slate-400">{label}</span>
      <span
        className="text-sm font-semibold"
        style={{
          color:
            {
              green: COLORS.green,
              red: COLORS.red,
              white: "#fff",
            }[tone] ?? "#fff",
        }}
      >
        {value}
      </span>
    </div>
  );
}
