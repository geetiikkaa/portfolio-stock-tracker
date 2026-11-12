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
import { useMemo, memo, useEffect, useState, useRef } from "react";
import { COLORS } from "../../constants/ui";
import { formatTick } from "../../utils/utils";
import GrowthTooltip from "./GrowthToolTIp";
import SeriesToggle from "./SeriesToggle";
import ChartGradient from "./ChartGradient";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const TARGET_TICKS = {
  "1M": 5,
  "3M": 6,
  "1Y": 12,
};

function buildTicks(dates, count) {
  if (dates.length === 0) return [];
  if (dates.length <= count) return dates;
  const step = (dates.length - 1) / (count - 1);
  const ticks = [];
  for (let i = 0; i < count; i++) {
    ticks.push(dates[Math.round(i * step)]);
  }
  return ticks;
}

function PortfolioGrowthCard({ range, visibleSeries, toggleSeries }) {
  const [niftyCache, setNiftyCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (niftyCache[range]) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const fetchNifty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/portfolio/growth`, {
          params: { range },
          headers: { Authorization: `Bearer ${token}` },
          signal: abortRef.current.signal,
        });
        if (data.success) {
          setNiftyCache((prev) => ({ ...prev, [range]: data.data }));
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to fetch NIFTY data:", err);
          setError("Failed to load NIFTY 50 data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNifty();
  }, [range]);

  const growthData = useMemo(() => {
    const response = niftyCache[range];
    const niftyPoints = response?.nifty || [];
    const portfolioPoints = response?.portfolio || [];

    // If only NIFTY is available (no portfolio yet), plot NIFTY alone
    const hasPortfolio = portfolioPoints.length > 0;
    const hasNifty = niftyPoints.length > 0;

    if (!hasNifty) return [];

    const nifty = [...niftyPoints].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // --- NIFTY-only path (portfolio not loaded yet) ---
    if (!hasPortfolio) {
      return nifty.map((point) => ({
        date: new Date(point.date).getTime(),
        // Backend already returns % change from day 0 — use directly
        nifty: point.nifty,
        portfolio: null,
      }));
    }

    // --- Both series available: align on overlapping date window ---
    const portfolio = [...portfolioPoints].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // Find the later of the two start dates so both series begin at 0%
    const startDate = Math.max(
      new Date(portfolio[0].date).getTime(),
      new Date(nifty[0].date).getTime(),
    );

    const alignedPortfolio = portfolio.filter(
      (p) => new Date(p.date).getTime() >= startDate,
    );
    const alignedNifty = nifty.filter(
      (p) => new Date(p.date).getTime() >= startDate,
    );

    if (!alignedPortfolio.length) return [];

    // Portfolio: convert absolute INR value → % change from its own day-0
    const basePortfolio = alignedPortfolio[0].value;

    // NIFTY: backend gives % from its own day-0, but after the startDate
    // filter, the first remaining point may not be 0 — re-anchor to 0
    const baseNiftyPct = alignedNifty.length > 0 ? alignedNifty[0].nifty : 0;

    // Build a fast timestamp→nifty lookup for forward-fill
    let niftyIndex = 0;
    let latestNiftyPct = null;

    return alignedPortfolio.map((point) => {
      const timestamp = new Date(point.date).getTime();

      // Advance NIFTY pointer up to this portfolio date (forward-fill gaps)
      while (
        niftyIndex < alignedNifty.length &&
        new Date(alignedNifty[niftyIndex].date).getTime() <= timestamp
      ) {
        latestNiftyPct = alignedNifty[niftyIndex].nifty;
        niftyIndex++;
      }

      return {
        date: timestamp,
        portfolio:
          basePortfolio > 0
            ? Number(
                (((point.value - basePortfolio) / basePortfolio) * 100).toFixed(
                  2,
                ),
              )
            : 0,
        // Re-anchor: subtract the first NIFTY % in the window so both
        // series start at 0% from the same date
        nifty:
          latestNiftyPct !== null
            ? Number((latestNiftyPct - baseNiftyPct).toFixed(2))
            : null,
      };
    });
  }, [range, niftyCache]);

  const xTicks = useMemo(() => {
    const dates = growthData.map((d) => d.date);
    return buildTicks(dates, TARGET_TICKS[range] ?? 7);
  }, [growthData, range]);

  return (
    <Card className="lg:col-span-2 h-[320px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-white">
            Portfolio Value Trend
          </h2>
          {isLoading && (
            <span className="text-[11px] text-slate-500 animate-pulse">
              Loading…
            </span>
          )}
          {error && !isLoading && (
            <span className="text-[11px] text-red-400">{error}</span>
          )}
        </div>
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
              dataKey="date"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              ticks={xTicks}
              tickFormatter={(ts) => formatTick(new Date(ts), range)}
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
                connectNulls={false}
              />
            )}
            {visibleSeries.nifty && (
              <Area
                type="monotone"
                dataKey="nifty"
                stroke="none"
                fill="url(#niftyFill)"
                isAnimationActive={false}
                connectNulls={false}
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
                connectNulls={false}
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
                connectNulls={false}
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
