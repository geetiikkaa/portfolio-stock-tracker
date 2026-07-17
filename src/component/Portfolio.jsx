import { useMemo, useState } from "react";
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
import {
  cardStyle,
  INITIAL_TRANSACTIONS,
  C,
  ASSET_TABS,
} from "../constants/mockDataUnified";
import { buildHoldings, formatINR } from "../utils/utils";
import AddHoldingForm from "./ui/AddHoldingForm";
import ProfileModal from "./ui/ProfileModal";

export default function PortfolioPage() {
  let [activeTab, setActiveTab] = useState("All");
  let [editingTicker, setEditingTicker] = useState(null);
  let [showAddForm, setShowAddForm] = useState(false);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  let [priceOverrides, setPriceOverrides] = useState({});
  let [editValue, setEditValue] = useState("");
  let holdings = useMemo(
    () => buildHoldings(transactions, priceOverrides),
    [transactions, priceOverrides],
  );
  let { totalInvestment, currentValue } = holdings.reduce(
    (acc, holding) => {
      acc.totalInvestment += holding.invested;
      acc.currentValue += holding.qty * holding.current;
      return acc;
    },
    { totalInvestment: 0, currentValue: 0 },
  );
  let totalProfit = currentValue - totalInvestment;
  let totalProfitPct = totalInvestment
    ? (totalProfit / totalInvestment) * 100
    : 0;
  let isProfit = totalProfit >= 0;

  let summary = useMemo(
    () => [
      {
        label: "Total Investment",
        value: formatINR(totalInvestment),
        sub: `${holdings.length} positions`,
        subColor: C.blue,
      },
      {
        label: "Current Value",
        value: formatINR(currentValue),
        sub: "Live estimate",
        subColor: C.purple,
      },
      {
        label: "Total P / L",
        value: `${isProfit ? "+" : ""}${formatINR(totalProfit)}`,
        sub: `${isProfit ? "+" : ""}${totalProfitPct.toFixed(2)}%`,
        subColor: isProfit ? C.green : C.red,
        right: isProfit ? (
          <TrendingUp size={18} color={C.green} />
        ) : (
          <TrendingDown size={18} color={C.red} />
        ),
      },
    ],
    [
      holdings.length,
      totalInvestment,
      currentValue,
      totalProfit,
      totalProfitPct,
    ],
  );
  let filteredHoldings = useMemo(
    () =>
      activeTab === "All"
        ? holdings
        : holdings.filter((h) => h.assetClass === activeTab),
    [holdings, activeTab],
  );
  let handleAddHolding = (holding) => {
    let newTx = {
      id: Date.now(),
      type: "Buy",
      status: "Completed",
      ...holding,
    };

    setTransactions((prev) => [...prev, newTx]);
  };
  let handleDelete = (ticker) => {
    setTransactions((prev) => prev.filter((t) => t.ticker !== ticker));
  };
  let handleEdit = (ticker, currentPrice) => {
    if (editingTicker === ticker) {
      setEditingTicker(null);
      return;
    }

    setEditValue(String(currentPrice));
    setEditingTicker(ticker);
  };
  let commitPrice = (ticker) => {
    let parsed = parseFloat(editValue);
    if (!Number.isNaN(parsed)) {
      setPriceOverrides((prev) => ({ ...prev, [ticker]: parsed }));
    }
    setEditingTicker(null);
  };

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
      <div
        className="min-h-screen w-full flex text-white"
        style={{ background: "#0a0a12" }}
      >
        <PortfolioSidebar />
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Track and manage your investments
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 bg-gradient-to-r from-[#5b6cff] to-[#b14ef5]"
                style={{
                  boxShadow: `0 4px 20px ${C.purple}33`,
                }}
              >
                {showAddForm ? (
                  <>✕ Cancel</>
                ) : (
                  <>
                    <Plus size={15} />
                    Add New
                  </>
                )}
              </button>
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          {showAddForm && (
            <div className="mb-6">
              <AddHoldingForm
                onSubmit={handleAddHolding}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {summary.map((card) => (
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
          <div
            className="flex items-center gap-6 border-b mb-5"
            style={{ borderColor: C.cardBorder }}
          >
            {ASSET_TABS.map((tab) => (
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
          {filteredHoldings.length === 0 && activeTab !== "All" ? (
            <div
              className="rounded-2xl border flex flex-col items-center justify-center py-20 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: C.cardBorder,
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
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: cardStyle.background }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="text-left text-xs uppercase tracking-wide border-b"
                      style={{ borderColor: C.cardBorder, color: "#6b7280" }}
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
                      let plPos = h.pl >= 0;
                      let isEditing = editingTicker === h.ticker;
                      return (
                        <tr
                          key={h.ticker}
                          className="border-b last:border-0 transition"
                          style={{
                            borderColor: C.cardBorder,
                            background: isEditing
                              ? "rgba(255,255,255,0.03)"
                              : "transparent",
                          }}
                        >
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
                          <td className="px-5 py-4 text-gray-300">{h.qty}</td>
                          <td className="px-5 py-4 text-gray-300">
                            {formatINR(h.buy)}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {isEditing ? (
                              <input
                                type="number"
                                autoFocus
                                className="w-24 bg-white/10 rounded px-2 py-1 text-white text-sm outline-none border border-white/20 focus:border-purple-500"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitPrice(h.ticker);
                                }}
                              />
                            ) : (
                              formatINR(h.current)
                            )}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {formatINR(h.invested)}
                          </td>
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
                              {formatINR((h.invested * h.pl) / 100)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(h.ticker, h.current)}
                                title="Edit current price"
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
                                title="Remove all transactions for this ticker"
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
              <div
                className="mt-5 rounded-2xl px-8 py-5 flex items-center justify-between flex-wrap gap-6"
                style={{
                  background: cardStyle.background,
                }}
              >
                {summary.map(({ label, value, color }, i, arr) => (
                  <div key={label} className="flex items-center gap-8">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{label}</div>
                      <div
                        className="text-base font-semibold"
                        style={{ color }}
                      >
                        {value}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="h-10 w-px hidden sm:block"
                        style={{ background: C.cardBorder }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
