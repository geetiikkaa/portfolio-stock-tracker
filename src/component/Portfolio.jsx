import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart2,
} from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import StatCard from "./ui/StatCard";
import { cardStyle } from "../constants/mockData";

export const C = {
  purple: "#7c5cff",
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  surface: "#12121e",
  card: "#1a1a2e",
  border: "rgba(255,255,255,0.08)",
};

const HOLDINGS = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    initial: "A",
    color: "#2b2b2b",
    qty: 10,
    buy: 18000,
    current: 21250,
    invested: 180000,
    pl: 18.06,
  },
  {
    ticker: "RELIANCE",
    name: "Reliance Ind.",
    initial: "R",
    color: "#e0651a",
    qty: 5,
    buy: 2400,
    current: 2890,
    invested: 12000,
    pl: 20.42,
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy",
    initial: "T",
    color: "#163b8f",
    qty: 8,
    buy: 3200,
    current: 4150,
    invested: 25600,
    pl: 29.69,
  },
  {
    ticker: "INFY",
    name: "Infosys Ltd.",
    initial: "I",
    color: "#1565c0",
    qty: 15,
    buy: 1550,
    current: 1680,
    invested: 23250,
    pl: 8.39,
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    initial: "H",
    color: "#8c1c1c",
    qty: 6,
    buy: 1500,
    current: 1750,
    invested: 9000,
    pl: 16.67,
  },
];
const TABS = ["All Holdings", "Equity", "Mutual Funds", "Crypto", "Cash"];
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("All Holdings");
  const [holdings, setHoldings] = useState(HOLDINGS);
  const [editingTicker, setEditingTicker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  /* Summary stats */
  const totalInvestment = holdings.reduce((sum, h) => sum + h.invested, 0);
  const currentValue = holdings.reduce(
    (sum, h) => sum + h.invested * (1 + h.pl / 100),
    0,
  );
  const totalProfit = currentValue - totalInvestment;
  const totalProfitPct =
    totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  const isProfit = totalProfit >= 0;

  /* Filter by tab */
  const filteredHoldings =
    activeTab === "All Holdings"
      ? holdings
      : []; /* extend with category data as needed */

  /* Delete a holding */
  const handleDelete = (ticker) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
  };

  /* Inline edit toggle */
  const handleEdit = (ticker) => {
    setEditingTicker((prev) => (prev === ticker ? null : ticker));
  };

  /* Update a field inline */
  const handleFieldChange = (ticker, field, value) => {
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.ticker !== ticker) return h;
        const updated = { ...h, [field]: parseFloat(value) || 0 };
        /* Recalculate P/L when buy or current changes */
        if (field === "buy" || field === "current") {
          updated.pl =
            updated.buy > 0
              ? ((updated.current - updated.buy) / updated.buy) * 100
              : 0;
        }
        /* Recalculate invested when qty or buy changes */
        if (field === "qty" || field === "buy") {
          updated.invested = updated.qty * updated.buy;
        }
        return updated;
      }),
    );
  };

  return (
    <div
      className="min-h-screen w-full flex text-white"
      style={{ background: "#0a0a12" }}
    >
      <PortfolioSidebar />

      <main className="flex-1 p-8 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Track and manage your investments
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 bg-gradient-to-r from-[#5b6cff] to-[#b14ef5]"
              style={{
                boxShadow: `0 4px 20px ${C.purple}33`,
              }}
            >
              <Plus size={15} />
              Add New
            </button>
            <ProfileAvatar />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Investment",
              value: inr(Math.round(totalInvestment)),
              sub: `${holdings.length} positions`,
              subColor: C.blue,
            },
            {
              label: "Current Value",
              value: inr(Math.round(currentValue)),
              sub: "Live estimate",
              subColor: C.purple,
            },
            {
              label: "Total P / L",
              value: `${isProfit ? "+" : ""}${inr(Math.round(totalProfit))}`,
              sub: `${isProfit ? "+" : ""}${totalProfitPct.toFixed(2)}%`,
              subColor: isProfit ? C.green : C.red,
              right: isProfit ? (
                <TrendingUp size={18} color={C.green} />
              ) : (
                <TrendingDown size={18} color={C.red} />
              ),
            },
          ].map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              sub={card.sub}
              subColor={card.subColor}
              right={card.right}
            />
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-6 border-b mb-5"
          style={{ borderColor: C.border }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm transition ${
                activeTab === tab
                  ? "text-white font-medium"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span
                  className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${C.purple}, ${C.blue})`,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Empty state for non-implemented tabs */}
        {activeTab !== "All Holdings" ? (
          <div
            className="rounded-2xl border flex flex-col items-center justify-center py-20 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: C.border,
            }}
          >
            <BarChart2 size={36} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              No {activeTab} holdings yet
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Add your first position to get started
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: cardStyle.background }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left text-xs uppercase tracking-wide border-b"
                    style={{ borderColor: C.border, color: "#6b7280" }}
                  >
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Buy Price</th>
                    <th className="px-5 py-3 font-medium">Current</th>
                    <th className="px-5 py-3 font-medium">Invested</th>
                    <th className="px-5 py-3 font-medium">P / L</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((h) => {
                    const plPos = h.pl >= 0;
                    const isEditing = editingTicker === h.ticker;
                    return (
                      <tr
                        key={h.ticker}
                        className="border-b last:border-0 transition"
                        style={{
                          borderColor: C.border,
                          background: isEditing
                            ? "rgba(255,255,255,0.03)"
                            : "transparent",
                        }}
                      >
                        {/* Stock */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ backgroundColor: h.color }}
                            >
                              {h.initial}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {h.ticker}
                              </div>
                              <div className="text-xs text-gray-500">
                                {h.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Qty */}
                        <td className="px-5 py-4 text-gray-300">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 bg-white/10 rounded px-2 py-1 text-white text-sm outline-none border border-white/20 focus:border-purple-500"
                              value={h.qty}
                              onChange={(e) =>
                                handleFieldChange(
                                  h.ticker,
                                  "qty",
                                  e.target.value,
                                )
                              }
                            />
                          ) : (
                            h.qty
                          )}
                        </td>

                        {/* Buy Price */}
                        <td className="px-5 py-4 text-gray-300">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-24 bg-white/10 rounded px-2 py-1 text-white text-sm outline-none border border-white/20 focus:border-purple-500"
                              value={h.buy}
                              onChange={(e) =>
                                handleFieldChange(
                                  h.ticker,
                                  "buy",
                                  e.target.value,
                                )
                              }
                            />
                          ) : (
                            inr(h.buy)
                          )}
                        </td>

                        {/* Current Price */}
                        <td className="px-5 py-4 text-gray-300">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-24 bg-white/10 rounded px-2 py-1 text-white text-sm outline-none border border-white/20 focus:border-purple-500"
                              value={h.current}
                              onChange={(e) =>
                                handleFieldChange(
                                  h.ticker,
                                  "current",
                                  e.target.value,
                                )
                              }
                            />
                          ) : (
                            inr(h.current)
                          )}
                        </td>

                        {/* Invested */}
                        <td className="px-5 py-4 text-gray-300">
                          {inr(h.invested)}
                        </td>

                        {/* P/L */}
                        <td className="px-5 py-4">
                          <div
                            className="flex items-center gap-1 font-medium"
                            style={{ color: plPos ? C.green : C.red }}
                          >
                            {plPos ? (
                              <TrendingUp size={13} />
                            ) : (
                              <TrendingDown size={13} />
                            )}
                            {plPos ? "+" : ""}
                            {h.pl.toFixed(2)}%
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{
                              color: plPos ? "#6ee7b7" : "#fca5a5",
                              opacity: 0.75,
                            }}
                          >
                            {plPos ? "+" : ""}
                            {inr(Math.round((h.invested * h.pl) / 100))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(h.ticker)}
                              className="h-7 w-7 flex items-center justify-center rounded-md transition"
                              style={{
                                background: isEditing
                                  ? `${C.purple}33`
                                  : "rgba(255,255,255,0.05)",
                                color: isEditing ? C.purple : "#9ca3af",
                              }}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(h.ticker)}
                              className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredHoldings.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-12 text-gray-600 text-sm"
                      >
                        No holdings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary footer */}
            <div
              className="mt-5 rounded-2xl px-8 py-5 flex items-center justify-between flex-wrap gap-6"
              style={{
                background: cardStyle.background,
              }}
            >
              {[
                {
                  label: "Total Investment",
                  value: inr(Math.round(totalInvestment)),
                  color: "#d1d5db",
                },
                {
                  label: "Current Value",
                  value: inr(Math.round(currentValue)),
                  color: "#d1d5db",
                },
                {
                  label: "Total Profit / Loss",
                  value: `${isProfit ? "+" : ""}${inr(Math.round(totalProfit))} (${isProfit ? "+" : ""}${totalProfitPct.toFixed(2)}%)`,
                  color: isProfit ? C.green : C.red,
                },
              ].map(({ label, value, color }, i, arr) => (
                <div key={label} className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-base font-semibold" style={{ color }}>
                      {value}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="h-10 w-px hidden sm:block"
                      style={{ background: C.border }}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add New Modal */}
      {showAddModal && (
        <AddHoldingModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newHolding) => {
            setHoldings((prev) => [...prev, newHolding]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
const COLORS = [
  "#2b2b2b",
  "#e0651a",
  "#163b8f",
  "#1565c0",
  "#8c1c1c",
  "#0f766e",
  "#7c3aed",
];

function AddHoldingModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    ticker: "",
    name: "",
    qty: "",
    buy: "",
    current: "",
    color: COLORS[0],
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = () => {
    if (!form.ticker || !form.name || !form.qty || !form.buy || !form.current)
      return;
    const qty = parseFloat(form.qty);
    const buy = parseFloat(form.buy);
    const current = parseFloat(form.current);
    const invested = qty * buy;
    const pl = buy > 0 ? ((current - buy) / buy) * 100 : 0;
    onAdd({
      ticker: form.ticker.toUpperCase(),
      name: form.name,
      initial: form.ticker[0].toUpperCase(),
      color: form.color,
      qty,
      buy,
      current,
      invested,
      pl,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
        style={{ background: "#12121e", borderColor: C.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Add holding</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              label: "Ticker symbol",
              field: "ticker",
              placeholder: "e.g. AAPL",
            },
            {
              label: "Company name",
              field: "name",
              placeholder: "e.g. Apple Inc.",
            },
            {
              label: "Quantity",
              field: "qty",
              placeholder: "10",
              type: "number",
            },
            {
              label: "Buy price (₹)",
              field: "buy",
              placeholder: "18000",
              type: "number",
            },
            {
              label: "Current price (₹)",
              field: "current",
              placeholder: "21250",
              type: "number",
            },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="text-xs text-gray-500 mb-1 block">
                {label}
              </label>
              <input
                type={type || "text"}
                placeholder={placeholder}
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none border transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: C.border,
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2 text-sm text-gray-400 border transition hover:text-white"
            style={{ borderColor: C.border }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            }}
          >
            Add holding
          </button>
        </div>
      </div>
    </div>
  );
}
