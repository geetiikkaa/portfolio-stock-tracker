import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { Star, X, ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import Tabs from "./ui/Tabs";
import ProfileModal from "./ui/ProfileModal";
import { C, cardStyle } from "../constants/ui";
import { trendSpark } from "../utils/utils";
import axios from "axios";

let TABS = ["All", "Favourites", "Trending"];
let BASE_URL = import.meta.env.VITE_BASE_URL;

function Sparkline({ data, color, width = 90, height = 36 }) {
  let id = React.useId().replace(/:/g, "");
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />

          <Area
            type="linear"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#wl-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function WatchlistRow({ stock, onToggleFavourite, onRemove }) {
  let positive = stock.change >= 0;
  let changeColor = positive ? C.green : C.red;

  return (
    <tr
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      className="group"
    >
      <td className="py-4 pr-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleFavourite(stock.id, stock.favourite)}
            className="shrink-0"
            aria-label="Toggle favourite"
          >
            <Star
              size={15}
              fill={stock.favourite ? C.orange : "none"}
              color={stock.favourite ? C.orange : C.mutedSoft}
              strokeWidth={1.5}
            />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: stock.color, color: "#fff" }}
          >
            {stock.initial}
          </div>
          <div>
            <div
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: C.text }}
            >
              {stock.ticker}
              {stock.trending && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: C.greenSoft, color: C.green }}
                >
                  Trending
                </span>
              )}
            </div>
            <div className="text-xs" style={{ color: C.muted }}>
              {stock.name}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 text-sm" style={{ color: C.text }}>
        ₹{stock.price.toLocaleString("en-IN")}
      </td>
      <td className="py-4 text-sm font-medium" style={{ color: changeColor }}>
        {positive ? "+" : ""}
        {stock.change.toFixed(2)}%
      </td>
      <td className="py-4">
        <Sparkline data={stock.spark} color={changeColor} />
      </td>
      <td className="py-4 pl-2 text-right">
        <button
          onClick={() => onRemove(stock.id)}
          className="opacity-0 group-hover:opacity-100 transition"
          style={{ color: C.mutedSoft }}
          aria-label="Remove from watchlist"
        >
          <X size={15} />
        </button>
      </td>
    </tr>
  );
}

let SortIcon = ({ active, sortDirection }) =>
  active ? (
    sortDirection === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    )
  ) : null;

export default function Watchlist() {
  let [stocks, setStocks] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let [error, setError] = useState(null);
  let [activeTab, setActiveTab] = useState("All");
  let [sortKey, setSortKey] = useState(null);
  let [sortDirection, setSortDirection] = useState("desc");
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  function getColor(ticker = "") {
    const colors = [
      C.blue,
      C.purple,
      C.green,
      C.red,
      "#f59e0b",
      "#14b8a6",
      "#6366f1",
      "#ec4899",
    ];

    let hash = 0;

    for (let i = 0; i < ticker.length; i++) {
      hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  function mapWatchlist(apiWatchlist) {
    return apiWatchlist.map((item) => ({
      id: item._id,
      assetId: item.asset_id?._id,

      ticker: item.asset_id?.ticker,
      name: item.asset_id?.name,

      favourite: item.favourite,
      trending: item.trending,

      price: item.asset_id?.currentPrice ?? 0,
      change: item.asset_id?.percentChange ?? 0,

      initial: item.asset_id?.ticker[0],
      color: getColor(item.asset_id?.ticker),

      spark: trendSpark(
        (item.asset_id?.percentChange ?? 0) >= 0 ? "up" : "down",
      ),
    }));
  }

  const loadQuotes = async (stocks) => {
    const token = localStorage.getItem("token");

    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/market/quote/${stock.ticker}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            },
          );

          return {
            ...stock,
            price: data.data.currentPrice,
            change: data.data.percentChange,
            spark: trendSpark(data.data.percentChange >= 0 ? "up" : "down"),
          };
        } catch (err) {
          console.error(`Failed to fetch quote for ${stock.ticker}`, err);

          return stock;
        }
      }),
    );

    setStocks(updatedStocks);
  };

  const loadWatchlist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${BASE_URL}/watchlistItems`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const mapped = mapWatchlist(data.watchlist);

      setStocks(mapped);
      loadQuotes(mapped);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load watchlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  let filtered = useMemo(() => {
    return stocks.filter((stock) => {
      if (activeTab === "Favourites") return stock.favourite;
      if (activeTab === "Trending") return stock.trending;
      return true;
    });
  }, [stocks, activeTab]);
  let sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a[sortKey] - b[sortKey]
        : b[sortKey] - a[sortKey],
    );
  }, [filtered, sortKey, sortDirection]);
  function handleSort(key) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }
  const handleToggleFavourite = async (id, favourite) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/watchlistItems/${id}`,
        {
          favourite: !favourite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      setStocks((prev) =>
        prev.map((stock) =>
          stock.id === id
            ? {
                ...stock,
                favourite: !stock.favourite,
              }
            : stock,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/watchlistItems/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setStocks((prev) => prev.filter((stock) => stock.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
      <div className="flex">
        <PortfolioSidebar />
        <div
          className="w-full min-h-screen p-6 bg-[#0a0a12]"
          style={{
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold" style={{ color: C.text }}>
              Watchlist
            </div>
            <div className="flex gap-4">
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div style={cardStyle} className="p-5 mt-8">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <th
                    className="text-left pb-3 text-xs font-medium uppercase tracking-wide"
                    style={{ color: C.muted }}
                  >
                    Stock
                  </th>
                  <th
                    onClick={() => handleSort("price")}
                    className="text-left pb-3 text-xs font-medium uppercase tracking-wide cursor-pointer select-none"
                    style={{ color: C.muted }}
                  >
                    <span className="flex items-center gap-1">
                      Price
                      <SortIcon
                        active={sortKey === "price"}
                        sortDirection={sortDirection}
                      />
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("change")}
                    className="text-left pb-3 text-xs font-medium uppercase tracking-wide cursor-pointer select-none"
                    style={{ color: C.muted }}
                  >
                    <span className="flex items-center gap-1">
                      Change <SortIcon active={sortKey === "change"} />
                    </span>
                  </th>
                  <th
                    className="text-left pb-3 text-xs font-medium uppercase tracking-wide"
                    style={{ color: C.muted }}
                  >
                    Chart
                  </th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((stock) => (
                  <WatchlistRow
                    key={stock.id}
                    stock={stock}
                    onToggleFavourite={handleToggleFavourite}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
            {sorted.length === 0 && (
              <div
                className="py-10 text-center text-sm"
                style={{ color: C.muted }}
              >
                {activeTab === "Favourites"
                  ? "No favourites yet. Tap the star on a stock to add it here."
                  : activeTab === "Trending"
                    ? "Nothing trending right now."
                    : "Your watchlist is empty. Add a stock to get started."}
              </div>
            )}
          </div>
          <div className="text-xs mt-3" style={{ color: C.mutedSoft }}>
            Showing {sorted.length} of {stocks.length} stocks
          </div>
        </div>
      </div>
    </>
  );
}
