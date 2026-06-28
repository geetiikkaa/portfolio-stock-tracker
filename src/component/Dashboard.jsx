import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PortfolioSidebar from "./PortfolioSidebar";
import { useNavigate } from "react-router-dom";
import { RANGE_DATA, C, cardStyle, transactions } from "../constants/mockData";
import Dot from "./ui/Dot";
import Sparkline from "./ui/Sparkline";
import StatCard from "./ui/StatCard";
import HealthGauge from "./ui/HealthGauge";
import TopBar from "./ui/TopBar";
import CustomTooltip from "./ui/CustomToolTip";
import TimeRangeDropdown from "./ui/TimeRangeDropdown";
import AssetAllocationChart from "./ui/AssetAllocationChart";

const spark = (base, variance) =>
  Array.from({ length: 10 }, (_, i) => ({
    i,
    v: base + Math.sin(i * 1.3) * variance + i * (variance / 4),
  }));

const sparkPortfolio = spark(10, 3);
const sparkProfit = spark(8, 4);
const sparkNifty = spark(10, 2.5);
const sparkSensex = spark(10, 2);
const sparkNasdaq = spark(10, 2.8);

const indices = [
  { name: "NIFTY 50", value: "22,302.50", change: "+1.25%", spark: sparkNifty },
  { name: "SENSEX", value: "73,525.45", change: "+1.08%", spark: sparkSensex },
  { name: "NASDAQ", value: "18,567.19", change: "+1.35%", spark: sparkNasdaq },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState("This Year");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const rangeRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rangeRef.current && !rangeRef.current.contains(e.target)) {
        setIsRangeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredTransactions = query
    ? transactions.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query),
      )
    : transactions;

  const filteredIndices = query
    ? indices.filter((idx) => idx.name.toLowerCase().includes(query))
    : indices;

  const selectedData = RANGE_DATA[selectedRange].data;
  const changeLabel = RANGE_DATA[selectedRange].changeLabel;

  return (
    <div className="flex">
      <PortfolioSidebar />
      <div
        className="w-full min-h-screen p-6"
        style={{
          background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgBottom} 100%)`,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .dashboard-search::placeholder { color: ${C.mutedSoft}; }
        `}</style>

        {/* Top bar */}
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xl font-bold" style={{ color: C.text }}>
              Good Morning, Geetika 👋
            </div>
            <div className="text-sm mt-1" style={{ color: C.muted }}>
              Here's what's happening with your portfolio today.
            </div>
          </div>

          {/* Time-range dropdown */}
          <TimeRangeDropdown
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard
            label="Total Portfolio Value"
            value="₹24,75,430"
            sub={changeLabel}
            subColor={C.green}
            spark={sparkPortfolio}
            sparkColor={C.green}
          />
          <StatCard
            label="Today's Profit / Loss"
            value="₹6,347.21"
            sub="+2.35%"
            subColor={C.green}
            spark={sparkProfit}
            sparkColor={C.green}
          />
          <StatCard label="Total Investment" value="₹18,45,000" />
          <div
            style={cardStyle}
            className="p-5 flex items-center justify-between"
          >
            <div>
              <div className="text-xs" style={{ color: C.muted }}>
                Portfolio Health
              </div>
              <div
                className="text-2xl font-bold mt-2"
                style={{ color: C.text }}
              >
                85/100
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: C.green }}
              >
                Excellent
              </div>
            </div>
            <HealthGauge score={85} />
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div style={cardStyle} className="p-5 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold" style={{ color: C.text }}>
                Portfolio Performance
              </div>
              <div className="text-xs" style={{ color: C.muted }}>
                {selectedRange}
              </div>
            </div>
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={selectedData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={C.purple}
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="100%"
                        stopColor={C.purple}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.mutedSoft, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.mutedSoft, fontSize: 12 }}
                    tickFormatter={(v) => `₹${v.toFixed(0)}L`}
                    domain={[0, 30]}
                    ticks={[0, 10, 20, 30]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={C.purple}
                    strokeWidth={2.5}
                    fill="url(#perfFill)"
                    dot={(props) => (
                      <Dot {...props} total={selectedData.length} />
                    )}
                    activeDot={{
                      r: 6,
                      fill: C.purple,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <AssetAllocationChart />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          <div style={cardStyle} className="p-5 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold" style={{ color: C.text }}>
                Recent Transactions
              </div>
              <div
                className="text-xs font-medium cursor-pointer"
                style={{ color: C.purple }}
                onClick={() => navigate("/transactions")}
              >
                View All
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {filteredTransactions.length === 0 ? (
                <div
                  className="text-sm text-center py-6"
                  style={{ color: C.muted }}
                >
                  No transactions match "{searchQuery}".
                </div>
              ) : (
                filteredTransactions.map((t) => (
                  <div
                    key={t.symbol}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ background: `${t.color}22`, color: t.color }}
                      >
                        {t.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: C.text }}
                        >
                          {t.symbol}{" "}
                          <span
                            className="font-normal"
                            style={{ color: C.muted }}
                          >
                            - {t.name}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: C.muted }}>
                          {t.action}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: C.text }}
                      >
                        {t.amount}
                      </div>
                      <div className="text-xs" style={{ color: C.muted }}>
                        {t.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={cardStyle} className="p-5">
            <div className="flex items-center justify-between mb-3">
              {" "}
              <div
                className="text-sm font-semibold mb-3"
                style={{ color: C.text }}
              >
                Market Snapshot
              </div>
              <div
                className="text-xs font-medium cursor-pointer"
                style={{ color: C.purple }}
                onClick={() => navigate("/market-overview")}
              >
                View All
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {filteredIndices.length === 0 ? (
                <div
                  className="text-sm text-center py-6"
                  style={{ color: C.muted }}
                >
                  No indices match "{searchQuery}".
                </div>
              ) : (
                filteredIndices.map((idx) => (
                  <div
                    key={idx.name}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: C.text }}
                      >
                        {idx.name}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: C.muted }}
                      >
                        {idx.value}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkline
                        data={idx.spark}
                        color={C.green}
                        width={60}
                        height={28}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: C.green }}
                      >
                        {idx.change}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
