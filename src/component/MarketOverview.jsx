import React, { useEffect, useMemo, useRef, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";

const C = {
  bgTop: "#0B0F1D",
  bgBottom: "#060810",
  card: "#11162A",
  cardBorder: "rgba(255,255,255,0.06)",
  text: "#F3F5FB",
  muted: "#8A91A8",
  mutedSoft: "#6B7286",
  green: "#34D6A0",
  greenSoft: "rgba(52,214,160,0.14)",
  purple: "#8C7CF6",
  red: "#F0716B",
  redSoft: "rgba(240,113,107,0.14)",
  blue: "#5B72F0",
  teal: "#2BCB8E",
  orange: "#F5A623",
  lavender: "#B49CF5",
};

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), #11162A",
  border: `1px solid ${C.cardBorder}`,
  borderRadius: "20px",
  boxShadow:
    "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
};

const spark = (
  points = 24,
  { start = 100, drift = 0.35, volatility = 3 } = {},
) => {
  let value = start;

  return Array.from({ length: points }, (_, i) => {
    let change = drift + (Math.random() - 0.5) * volatility * 2;

    // 20% chance of a sharp move
    if (Math.random() < 0.2) {
      change += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 5);
    }

    value += change;

    return {
      i,
      v: value,
    };
  });
};
const INDEX_CARDS = [
  {
    name: "NIFTY 50",
    value: "22,302.50",
    change: "+1.25%",
    spark: spark(24, {
      start: 100,
      drift: 0.35,
      volatility: 4,
    }),
  },
  {
    name: "SENSEX",
    value: "73,525.45",
    change: "+1.08%",
    spark: spark(24, {
      start: 95,
      drift: 0.3,
      volatility: 4,
    }),
  },
  {
    name: "NASDAQ",
    value: "18,567.19",
    change: "+1.35%",
    spark: spark(24, {
      start: 110,
      drift: 0.5,
      volatility: 4,
    }),
  },
  {
    name: "BANK NIFTY",
    value: "48,125.30",
    change: "+1.46%",
    spark: spark(24, {
      start: 90,
      drift: 0.45,
      volatility: 4,
    }),
  },
];

const TOP_GAINERS = [
  { stock: "NVDA", price: 1195.55, change: 8.24 },
  { stock: "ADANIENT", price: 3245.6, change: 6.35 },
  { stock: "TITAN", price: 3408.5, change: 5.21 },
  { stock: "WIPRO", price: 512.35, change: 4.25 },
  { stock: "COALINDIA", price: 542.6, change: 3.98 },
  { stock: "TATAMOTORS", price: 945.2, change: 3.72 },
  { stock: "ONGC", price: 268.15, change: 3.45 },
  { stock: "SBIN", price: 812.9, change: 3.1 },
  { stock: "AXISBANK", price: 1145.65, change: 2.88 },
  { stock: "ITC", price: 438.2, change: 2.55 },
];

const TOP_LOSERS = [
  { stock: "M&M", price: 2615.9, change: -3.25 },
  { stock: "BAJFINANCE", price: 6026.25, change: -2.45 },
  { stock: "NESTLEIND", price: 2150.15, change: -2.1 },
  { stock: "MARUTI", price: 10250.3, change: -1.85 },
  { stock: "POWERGRID", price: 295.45, change: -1.65 },
  { stock: "HINDUNILVR", price: 2480.7, change: -1.52 },
  { stock: "ASIANPAINT", price: 2890.15, change: -1.38 },
  { stock: "BHARTIARTL", price: 1325.4, change: -1.2 },
  { stock: "KOTAKBANK", price: 1745.85, change: -1.05 },
  { stock: "ULTRACEMCO", price: 9875.6, change: -0.92 },
];

const MARKET_NEWS = [
  { title: "RBI keeps repo rate unchanged", time: "2h ago" },
  { title: "Global markets rally ahead of US CPI data", time: "4h ago" },
  { title: "Oil prices rise on supply concerns", time: "6h ago" },
  { title: "IT sector stocks surge on strong earnings", time: "8h ago" },
  { title: "Rupee strengthens against the dollar", time: "10h ago" },
  { title: "FIIs turn net buyers in Indian equities", time: "12h ago" },
];

function Sparkline({ data, color, width = 70, height = 28 }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <defs>
            <linearGradient id={`mo-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#mo-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SortIcon({ active, dir }) {
  if (!active) return null;
  return dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}
function MoversTable({ title, rows, color, expanded, onToggleExpand }) {
  const [sortKey, setSortKey] = useState(null); // "price" | "change"
  const [sortDir, setSortDir] = useState("desc");
  const visibleRows = expanded ? rows : rows.slice(0, 5);
  const sorted = useMemo(() => {
    if (!sortKey) return visibleRows;
    return [...visibleRows].sort((a, b) =>
      sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
    );
  }, [visibleRows, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div style={cardStyle} className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold" style={{ color: C.text }}>
          {title}
        </div>
        <button
          onClick={onToggleExpand}
          className="text-xs font-medium"
          style={{ color: C.purple }}
        >
          {expanded ? "Show Less" : "View All"}
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
            <th
              className="text-left pb-2 text-xs font-medium"
              style={{ color: C.muted }}
            >
              Stock
            </th>
            <th
              onClick={() => handleSort("price")}
              className="text-left pb-2 text-xs font-medium cursor-pointer select-none"
              style={{ color: C.muted }}
            >
              <span className="flex items-center gap-1">
                Price <SortIcon active={sortKey === "price"} dir={sortDir} />
              </span>
            </th>
            <th
              onClick={() => handleSort("change")}
              className="text-left pb-2 text-xs font-medium cursor-pointer select-none"
              style={{ color: C.muted }}
            >
              <span className="flex items-center gap-1">
                Change <SortIcon active={sortKey === "change"} dir={sortDir} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.stock}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <td
                className="py-2.5 text-sm font-medium"
                style={{ color: C.text }}
              >
                {row.stock}
              </td>
              <td className="py-2.5 text-sm" style={{ color: C.muted }}>
                {row.price.toLocaleString("en-IN")}
              </td>
              <td className="py-2.5 text-sm font-semibold" style={{ color }}>
                {row.change >= 0 ? "+" : ""}
                {row.change.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarketOverview() {
  const [gainersExpanded, setGainersExpanded] = useState(false);
  const [losersExpanded, setLosersExpanded] = useState(false);
  const [newsExpanded, setNewsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleNews = newsExpanded ? MARKET_NEWS : MARKET_NEWS.slice(0, 3);

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
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold" style={{ color: C.text }}>
            Market Overview
          </div>

          <div className="relative" ref={profileRef}>
            <ProfileAvatar />
            {profileOpen && (
              <div
                className="absolute right-0 mt-2 py-1.5 rounded-xl z-20"
                style={{
                  background: "#161B30",
                  border: `1px solid ${C.cardBorder}`,
                  minWidth: 160,
                  boxShadow: "0 12px 30px -10px rgba(0,0,0,0.6)",
                }}
              >
                {["Profile", "Settings", "Logout"].map((item) => (
                  <div
                    key={item}
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 text-sm cursor-pointer"
                    style={{ color: C.muted }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Index cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {INDEX_CARDS.map((idx) => (
            <div key={idx.name} style={cardStyle} className="p-5">
              <div className="text-xs" style={{ color: C.muted }}>
                {idx.name}
              </div>
              <div className="flex items-end justify-between mt-2 gap-2">
                <div className="text-xl font-bold flex-1 min-w-0" style={{ color: C.text }}>
                  {idx.value}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Sparkline
                    data={idx.spark}
                    color={C.green}
                    width={110}
                    height={42}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: C.green }}
                  >
                    {idx.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <MoversTable
            title="Top Gainers"
            rows={TOP_GAINERS}
            color={C.green}
            expanded={gainersExpanded}
            onToggleExpand={() => setGainersExpanded((v) => !v)}
          />
          <MoversTable
            title="Top Losers"
            rows={TOP_LOSERS}
            color={C.red}
            expanded={losersExpanded}
            onToggleExpand={() => setLosersExpanded((v) => !v)}
          />
          <div style={cardStyle} className="p-5 flex flex-col">
            <div
              className="text-sm font-semibold mb-3"
              style={{ color: C.text }}
            >
              Market News
            </div>
            <div className="flex flex-col gap-3.5 flex-1">
              {visibleNews.map((n, i) => (
                <div
                  key={n.title}
                  style={{
                    borderBottom:
                      i < visibleNews.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    paddingBottom: i < visibleNews.length - 1 ? 12 : 0,
                  }}
                >
                  <div className="text-sm" style={{ color: C.text }}>
                    {n.title}
                  </div>
                  <div className="text-xs mt-1" style={{ color: C.muted }}>
                    {n.time}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setNewsExpanded((v) => !v)}
              className="text-xs font-medium mt-3 text-left"
              style={{ color: C.purple }}
            >
              {newsExpanded ? "Show Less" : "View All News"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
