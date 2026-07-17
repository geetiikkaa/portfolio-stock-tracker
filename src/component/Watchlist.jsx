import React, { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { Plus, Star, X, ChevronUp, ChevronDown } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import Tabs from "./ui/Tabs";
import ProfileModal from "./ui/ProfileModal";
import { C, INITIAL_STOCKS } from "../constants/mockDataUnified";
import { trendSpark } from "../utils/utils";

let cardStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), #11162A",
  border: `1px solid ${C.cardBorder}`,
  borderRadius: "20px",
  boxShadow:
    "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
};
let TABS = ["All", "Favourites", "Trending"];
let AVATAR_COLORS = [C.blue, C.red, C.teal, C.orange, C.purple, C.lavender];
let emptyForm = {
  ticker: "",
  name: "",
  price: "",
  change: "",
  trending: false,
};

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

let SortIcon = ({ active, sortDirection }) =>
  active ? (
    sortDirection === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    )
  ) : null;

export default function Watchlist() {
  let [stocks, setStocks] = useState(INITIAL_STOCKS);
  let [activeTab, setActiveTab] = useState("All");
  let [sortKey, setSortKey] = useState(null); // "price" | "change"
  let [sortDirection, setSortDirection] = useState("desc");
  let [showForm, setShowForm] = useState(false);
  let [form, setForm] = useState(emptyForm);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
  function handleToggleFavourite(id) {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favourite: !s.favourite } : s)),
    );
  }
  function handleRemove(id) {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }
  function handleSubmit(e) {
    let ticker = form.ticker.trim().toUpperCase();
    let name = form.name.trim();
    let change = Number(form.change) || 0;

    e.preventDefault();
    if (!ticker || !name || !form.price) return;

    let newStock = {
      id: Date.now(),
      ticker,
      name,
      initial: ticker,
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

  let handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
              <button
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] text-white"
              >
                {showForm ? <X size={15} /> : <Plus size={15} />}
                {showForm ? "Cancel" : "Add Stock"}
              </button>
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              style={cardStyle}
              className="p-5 mb-5 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
            >
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: C.muted }}
                >
                  Ticker
                </label>
                <input
                  name="ticker"
                  value={form.ticker}
                  onChange={handleChange}
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
                <label
                  className="block text-xs mb-1"
                  style={{ color: C.muted }}
                >
                  Company Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                <label
                  className="block text-xs mb-1"
                  style={{ color: C.muted }}
                >
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
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
                <label
                  className="block text-xs mb-1"
                  style={{ color: C.muted }}
                >
                  Change %
                </label>
                <input
                  name="change"
                  type="number"
                  step="0.01"
                  value={form.change}
                  onChange={handleChange}
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
                  name="trending"
                  type="checkbox"
                  checked={form.trending}
                  onChange={handleChange}
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
