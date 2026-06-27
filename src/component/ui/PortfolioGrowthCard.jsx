import Card from "./Card";
import { COLORS, generateGrowthSeries } from "../../constants/mockData";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
} from "recharts";
import { useMemo } from "react";
import { RANGE_DAYS } from "../../constants/mockData";
import { formatTick } from "../../utils/utils";
import GrowthTooltip from "./GrowthToolTIp";

export default function PortfolioGrowthCard({
  range,
  visibleSeries,
  toggleSeries,
}) {
  const fullSeries = useMemo(() => generateGrowthSeries(RANGE_DAYS.All), []);
  const growthData = useMemo(() => {
    const days = RANGE_DAYS[range];
    return fullSeries.slice(-days).map((d) => ({
      ...d,
      label: formatTick(d.date, range),
    }));
  }, [fullSeries, range]);
  const tickInterval = Math.max(0, Math.ceil(growthData.length / 7) - 1);
  return (
    <Card className={"lg:col-span-2 h-[320px]"}>
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

      <div className="h-63 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={growthData}
            margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.purple}
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="niftyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.18} />
                <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
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
                  filter: "drop-shadow(0px 0px 6px rgba(124,110,246,0.55))",
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
                  filter: "drop-shadow(0px 0px 6px rgba(52,211,153,0.45))",
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
