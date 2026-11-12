import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import ProfileModal from "./ui/ProfileModal";
import { cardStyle, C } from "../constants/ui";
import ViewAllButton from "./ui/ViewAllButton";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

let BASE_URL = import.meta.env.VITE_BASE_URL;

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
          <Tooltip
            formatter={(value) => formatMarketPrice(value)}
            labelFormatter={(_, payload) => {
              if (!payload?.length) return "";
              return new Date(payload[0].payload.timestamp).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );
            }}
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
            }}
          />
          <YAxis hide domain={["dataMin", "dataMax"]} type="number" />
          <Area
            type="linear"
            dataKey="value"
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
                {row.symbol}
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

function formatMarketPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function MarketOverview() {
  let [gainersExpanded, setGainersExpanded] = useState(false);
  let [losersExpanded, setLosersExpanded] = useState(false);
  let [newsExpanded, setNewsExpanded] = useState(false);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let [indexCards, setIndexCards] = useState([]);
  let [isLoadingIndices, setIsLoadingIndices] = useState(true);
  let [indexError, setIndexError] = useState(null);
  let [marketMovers, setMarketMovers] = useState({ gainers: [], losers: [] });
  let [isMoversLoading, setIsMoversLoading] = useState(true);
  let [marketNews, setMarketNews] = useState([]);
  let [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    const loadMarketNews = async () => {
      try {
        setIsNewsLoading(true);

        const { data } = await axios.get(`${BASE_URL}/market/news`);

        setMarketNews(data.data);
      } catch (error) {
        console.error("Failed to load market news:", error);
      } finally {
        setIsNewsLoading(false);
      }
    };

    loadMarketNews();
  }, []);

  let visibleNews = newsExpanded ? marketNews : marketNews.slice(0, 3);

  useEffect(() => {
    const loadIndices = async () => {
      try {
        setIsLoadingIndices(true);
        setIndexError(null);

        const { data } = await axios.get(`${BASE_URL}/market/indices`);

        const indices = data.data;

        const indicesWithHistory = await Promise.all(
          indices.map(async (index) => {
            try {
              const historyResponse = await axios.get(
                `${BASE_URL}/market/indices/${encodeURIComponent(
                  index.symbol,
                )}/history`,
                {
                  params: {
                    range: "1d",
                    interval: "5m",
                  },
                },
              );

              return {
                ...index,
                history: historyResponse.data.data,
              };
            } catch (error) {
              console.error(
                `Failed to load history for ${index.symbol}:`,
                error,
              );

              return {
                ...index,
                history: [],
              };
            }
          }),
        );

        setIndexCards(indicesWithHistory);
      } catch (err) {
        console.error("Failed to load market indices:", err);
        setIndexError(
          err.response?.data?.message || "Failed to load market data.",
        );
      } finally {
        setIsLoadingIndices(false);
      }
    };

    loadIndices();
  }, []);

  useEffect(() => {
    const loadMarketMovers = async () => {
      try {
        setIsMoversLoading(true);

        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${BASE_URL}/market/movers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setMarketMovers(data.data);
      } catch (error) {
        console.error("Failed to load market movers:", error);
      } finally {
        setIsMoversLoading(false);
      }
    };

    loadMarketMovers();
  }, []);

  const topGainers = useMemo(() => {
    return marketMovers.gainers.map((item) => ({
      stock: item.name,
      symbol: item.symbol,
      price: item.currentPrice,
      change: item.percentChange,
    }));
  }, [marketMovers.gainers]);

  const topLosers = useMemo(() => {
    return marketMovers.losers.map((item) => ({
      stock: item.name,
      symbol: item.symbol,
      price: item.currentPrice,
      change: item.percentChange,
    }));
  }, [marketMovers.losers]);

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
            {isLoadingIndices ? (
              <div className="col-span-4 text-center py-10 text-slate-400">
                Loading market data...
              </div>
            ) : indexError ? (
              <div className="col-span-4 text-center py-10 text-red-400">
                {indexError}
              </div>
            ) : (
              indexCards.map((idx) => {
                const positive = idx.percentChange >= 0;
                const changeColor = positive ? C.green : C.red;

                return (
                  <div key={idx.symbol} style={cardStyle} className="p-5">
                    <div className="text-xs text-slate-400">{idx.name}</div>

                    <div className="flex items-end justify-between mt-2 gap-2">
                      <div className="text-xl font-bold flex-1 min-w-0 text-white">
                        {idx.currency === "INR" ? "₹" : "$"}
                        {formatMarketPrice(idx.currentPrice, idx.currency)}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Sparkline
                          data={idx.history || []}
                          color={changeColor}
                          width={110}
                          height={42}
                        />

                        <span
                          className="text-xs font-semibold"
                          style={{ color: changeColor }}
                        >
                          {positive ? "+" : ""}
                          {idx.percentChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 items-start">
            <MoversTable
              title="Top Gainers"
              rows={topGainers}
              color={C.green}
              expanded={gainersExpanded}
              onToggleExpand={() => setGainersExpanded((v) => !v)}
            />
            <MoversTable
              title="Top Losers"
              rows={topLosers}
              color={C.red}
              expanded={losersExpanded}
              onToggleExpand={() => setLosersExpanded((v) => !v)}
            />
            <div style={cardStyle} className="p-5 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="text-sm font-semibold mb-3 text-white">
                  Market News
                </div>
                <ViewAllButton
                  expand={newsExpanded}
                  toggleExpand={() => setNewsExpanded((v) => !v)}
                />
              </div>
              <div className="flex flex-col gap-3.5 flex-1">
                {visibleNews.map((n, i) => (
                  <div
                    key={n.url}
                    style={{
                      borderBottom:
                        i < visibleNews.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      paddingBottom: i < visibleNews.length - 1 ? 12 : 0,
                    }}
                  >
                    <div className="text-sm text-white">{n.title}</div>
                    <div className="text-xs mt-1 text-slate-400">
                      {formatDistanceToNow(new Date(n.time), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
