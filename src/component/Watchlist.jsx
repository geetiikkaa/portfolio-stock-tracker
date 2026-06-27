import React, { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Plus, Star, X, ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";

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

const TABS = ["All", "Favourites", "Trending"];
const AVATAR_COLORS = [C.blue, C.red, C.teal, C.orange, C.purple, C.lavender];

// Synthetic sparkline trend - real intraday history would come from a
// market-data API; this just gives each row a plausible up/down shape that
// matches its change %.
const trendSpark = (direction, points = 10) =>
  Array.from({ length: points }, (_, i) => ({
    i,
    v:
      direction === "up"
        ? 10 + i * 1.4 + Math.sin(i * 1.3) * 2
        : 22 - i * 1.4 + Math.sin(i * 1.3) * 2,
  }));

const INITIAL_STOCKS = [
  {
    id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    initial: "A",
    color: "#2B2F38",
    price: 21250,
    change: 2.35,
    favourite: true,
    trending: true,
  },
  {
    id: 2,
    ticker: "TSLA",
    name: "Tesla Inc.",
    initial: "T",
    color: "#B91C1C",
    price: 182.45,
    change: -1.25,
    favourite: false,
    trending: true,
  },
  {
    id: 3,
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    initial: "N",
    color: "#15803D",
    price: 1195.35,
    change: 3.2,
    favourite: true,
    trending: true,
  },
  {
    id: 4,
    ticker: "AMZN",
    name: "Amazon.com",
    initial: "A",
    color: "#B45309",
    price: 186.45,
    change: 0.85,
    favourite: false,
    trending: false,
  },
  {
    id: 5,
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    initial: "G",
    color: "#1D4ED8",
    price: 2852.65,
    change: 1.15,
    favourite: true,
    trending: false,
  },
].map((s) => ({ ...s, spark: trendSpark(s.change >= 0 ? "up" : "down") }));

const emptyForm = {
  ticker: "",
  name: "",
  price: "",
  change: "",
  trending: false,
};

function Sparkline({ data, color, width = 90, height = 36 }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <defs>
            <linearGradient id={`wl-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
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
  const positive = stock.change >= 0;
  const changeColor = positive ? C.green : C.red;

  return (
    <tr
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      className="group"
    >
      <td className="py-4 pr-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleFavourite(stock.id)}
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

export default function Watchlist() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [activeTab, setActiveTab] = useState("All");
  const [sortKey, setSortKey] = useState(null); // "price" | "change"
  const [sortDir, setSortDir] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    if (activeTab === "Favourites") return stocks.filter((s) => s.favourite);
    if (activeTab === "Trending") return stocks.filter((s) => s.trending);
    return stocks;
  }, [stocks, activeTab]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) =>
      sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
    );
  }, [filtered, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleToggleFavourite(id) {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favourite: !s.favourite } : s)),
    );
  }

  function handleRemove(id) {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.ticker.trim() || !form.name.trim() || !form.price) return;

    const change = Number(form.change) || 0;
    const newStock = {
      id: Date.now(),
      ticker: form.ticker.trim().toUpperCase(),
      name: form.name.trim(),
      initial: form.ticker.trim().slice(0, 1).toUpperCase(),
      color: AVATAR_COLORS[stocks.length % AVATAR_COLORS.length],
      price: Number(form.price),
      change,
      favourite: false,
      trending: form.trending,
      spark: trendSpark(change >= 0 ? "up" : "down"),
    };

    setStocks((prev) => [newStock, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  }

  const SortIcon = ({ active }) =>
    active ? (
      sortDir === "asc" ? (
        <ChevronUp size={12} />
      ) : (
        <ChevronDown size={12} />
      )
    ) : null;

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
          <div className="text-xl font-bold" style={{ color: C.text }}>
            Watchlist
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                color: "#fff",
              }}
            >
              {showForm ? <X size={15} /> : <Plus size={15} />}
              {showForm ? "Cancel" : "Add Stock"}
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                color: "#fff",
              }}
            >
              G
            </div>
          </div>
        </div>

        {/* Add stock form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={cardStyle}
            className="p-5 mb-5 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>
                Ticker
              </label>
              <input
                value={form.ticker}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ticker: e.target.value }))
                }
                placeholder="MSFT"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: "#1A2036",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs mb-1" style={{ color: C.muted }}>
                Company Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Microsoft Corp."
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: "#1A2036",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="3450"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: "#1A2036",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>
                Change %
              </label>
              <input
                type="number"
                step="0.01"
                value={form.change}
                onChange={(e) =>
                  setForm((f) => ({ ...f, change: e.target.value }))
                }
                placeholder="1.50"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: "#1A2036",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>
            <label
              className="flex items-center gap-2 text-sm col-span-2 sm:col-span-2 cursor-pointer select-none"
              style={{ color: C.muted }}
            >
              <input
                type="checkbox"
                checked={form.trending}
                onChange={(e) =>
                  setForm((f) => ({ ...f, trending: e.target.checked }))
                }
              />
              Mark as trending
            </label>
            <div className="col-span-2 sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                  color: "#fff",
                }}
              >
                Save Stock
              </button>
            </div>
          </form>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-4">
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-sm font-medium pb-1.5"
                style={{
                  color: active ? C.text : C.muted,
                  borderBottom: active
                    ? `2px solid ${C.purple}`
                    : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div style={cardStyle} className="p-5">
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
                    Price <SortIcon active={sortKey === "price"} />
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
                ? "No favourites yet — tap the star on a stock to add it here."
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
  );
}
