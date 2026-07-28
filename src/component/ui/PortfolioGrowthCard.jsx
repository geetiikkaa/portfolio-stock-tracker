import Card from "./Card";
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
import { useMemo, memo } from "react";
import {
  RANGE_DAYS,
} from "../../constants/mockDataUnified";
import { COLORS, generateGrowthSeries } from "../../constants/ui";
import { formatTick } from "../../utils/utils";
import GrowthTooltip from "./GrowthToolTIp";
import SeriesToggle from "./SeriesToggle";
import ChartGradient from "./ChartGradient";

function PortfolioGrowthCard({ range, visibleSeries, toggleSeries }) {
  let fullSeries = useMemo(() => generateGrowthSeries(RANGE_DAYS.All), []);
  let growthData = useMemo(() => {
    let days = RANGE_DAYS[range];
    return fullSeries.slice(-days).map((dataPoint) => ({
      ...dataPoint,
      label: formatTick(dataPoint.date, range),
    }));
  }, [fullSeries, range]);
  let tickInterval = Math.max(0, Math.ceil(growthData.length / 7) - 1);
  return (
    <Card className="lg:col-span-2 h-[320px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-white">
          Portfolio Growth
        </h2>
        <div className="flex items-center gap-4">
          <SeriesToggle
            name="portfolio"
            toggleSeries={toggleSeries}
            color={COLORS.purple}
            label="Your Portfolio"
            isVisible={visibleSeries.portfolio}
          />
          <SeriesToggle
            name="nifty"
            toggleSeries={toggleSeries}
            color={COLORS.green}
            label="NIFTY 50"
            isVisible={visibleSeries.nifty}
          />
        </div>
      </div>
      <div className="h-63 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={growthData}
            margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <ChartGradient
                id="portfolioFill"
                color={COLORS.purple}
                opacity={0.25}
              />
              <ChartGradient
                id="niftyFill"
                color={COLORS.green}
                opacity={0.18}
              />
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

export default memo(PortfolioGrowthCard);
