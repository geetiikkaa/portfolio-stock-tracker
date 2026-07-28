import React, { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import ProfileModal from "./ui/ProfileModal";
import {
  INDEX_CARDS,
  TOP_GAINERS,
  TOP_LOSERS,
  MARKET_NEWS,
} from "../constants/mockDataUnified";
import { cardStyle, C } from "../constants/ui";
import ViewAllButton from "./ui/ViewAllButton";

function Sparkline({ data, color, width = 70, height = 28 }) {
  let id = React.useId().replace(/:/g, "");
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
  let [sortKey, setSortKey] = useState(null);
  let [sortDir, setSortDir] = useState("desc");
  let visibleRows = expanded ? rows : rows.slice(0, 5);

  let sorted = useMemo(() => {
    let result = [...visibleRows];

    if (sortKey) {
      result.sort((a, b) =>
        sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
      );
    }

    return result;
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
        <div className="text-sm font-semibold text-white">{title}</div>
        <ViewAllButton expand={expanded} toggleExpand={onToggleExpand} />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left pb-2 text-xs font-medium text-slate-400">
              Stock
            </th>
            <th
              onClick={() => handleSort("price")}
              className="text-left pb-2 text-xs font-medium cursor-pointer select-none text-slate-400"
            >
              <span className="flex items-center gap-1">
                Price <SortIcon active={sortKey === "price"} dir={sortDir} />
              </span>
            </th>
            <th
              onClick={() => handleSort("change")}
              className="text-left pb-2 text-xs font-medium cursor-pointer select-none text-slate-400"
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
              <td className="py-2.5 text-sm font-medium text-white">
                {row.stock}
              </td>
              <td className="py-2.5 text-sm text-slate-400">
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
  let [gainersExpanded, setGainersExpanded] = useState(false);
  let [losersExpanded, setLosersExpanded] = useState(false);
  let [newsExpanded, setNewsExpanded] = useState(false);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let visibleNews = newsExpanded ? MARKET_NEWS : MARKET_NEWS.slice(0, 3);

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
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
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold text-white">Market Overview</div>
            <div className="relative">
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {INDEX_CARDS.map((idx) => (
              <div key={idx.name} style={cardStyle} className="p-5">
                <div className="text-xs text-slate-400">{idx.name}</div>
                <div className="flex items-end justify-between mt-2 gap-2">
                  <div className="text-xl font-bold flex-1 min-w-0 text-white">
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
              <div className="text-sm font-semibold mb-3 text-white">
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
                    <div className="text-sm text-white">{n.title}</div>
                    <div className="text-xs mt-1 text-slate-400">{n.time}</div>
                  </div>
                ))}
              </div>
              <ViewAllButton
                textAlignUtility="text-left"
                expand={newsExpanded}
                toggleExpand={() => setNewsExpanded((v) => !v)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
