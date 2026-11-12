import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Loader2,
  AlertTriangle,
  Star,
} from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import ProfileAvatar from "./ui/ProfileAvatar";
import StatCard from "./ui/StatCard";
import { cardStyle, C } from "../constants/ui";
import { ASSET_TABS } from "../constants/ui";
import { formatUSD } from "../utils/utils";
import ProfileModal from "./ui/ProfileModal";
import axios from "axios";

const TICKER_COLORS = [
  C.blue,
  C.purple,
  C.green,
  C.red,
  "#f59e0b",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
];

function getTickerColor(ticker = "") {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TICKER_COLORS[Math.abs(hash) % TICKER_COLORS.length];
}

function mapApiHoldings(apiHoldings = []) {
  return apiHoldings.map((h) => ({
    assetId: h.assetId,
    ticker: h.ticker,
    name: h.name,
    assetClass: h.assetClass,
    qty: h.quantity,
    buy: h.buyPrice,
    current: h.currentPrice,
    invested: h.invested,
    pl: h.profitLossPercent,
    plAmount: h.profitLoss,
    color: getTickerColor(h.ticker),
    initial: h.ticker ? h.ticker.charAt(0).toUpperCase() : "?",
  }));
}

let BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PortfolioPage() {
  let [activeTab, setActiveTab] = useState("All");
  // let [showAddForm, setShowAddForm] = useState(false);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let [holdings, setHoldings] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let [loadError, setLoadError] = useState(null);
  let [watchlist, setWatchlist] = useState(new Set());

  const loadPortfolio = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${BASE_URL}/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setHoldings(mapApiHoldings(data.data.holdings));
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load portfolio",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWatchlist = async (assetId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/watchlistItems`,
        {
          asset_id: assetId,
          favourite: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      alert("Added to watchlist!");
      setWatchlist((prev) => new Set(prev).add(assetId));
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Already in watchlist");
      } else {
        alert("Failed to add to watchlist");
        console.error(err);
      }
    }
  };

  const loadWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${BASE_URL}/watchlistItems`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWatchlist(new Set(data.watchlist.map((item) => item.asset_id._id)));
    } catch (err) {
      console.error("Failed to load watchlist", err);
    }
  };

  useEffect(() => {
    loadPortfolio();
    loadWatchlist();
  }, []);

  let displayHoldings = useMemo(() => holdings, [holdings]);

  let { totalInvestment, currentValue } = displayHoldings.reduce(
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
        value: formatUSD(totalInvestment),
        sub: `${displayHoldings.length} positions`,
        subColor: C.blue,
      },
      {
        label: "Current Value",
        value: formatUSD(currentValue),
        sub: "Live estimate",
        subColor: C.purple,
      },
      {
        label: "Total P/L",
        value: `${isProfit ? "+" : ""}${formatUSD(totalProfit)}`,
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
      displayHoldings.length,
      totalInvestment,
      currentValue,
      totalProfit,
      totalProfitPct,
    ],
  );

  let filteredHoldings = useMemo(
    () =>
      activeTab === "All"
        ? displayHoldings
        : displayHoldings.filter((h) => h.assetClass === activeTab),
    [displayHoldings, activeTab],
  );

  let handleDelete = (ticker) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
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
              {/* <button
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
              </button> */}
              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
          {/* {showAddForm && (
            <div className="mb-6">
              <AddHoldingForm
                onSubmit={handleAddHolding}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )} */}

          {loadError && (
            <div
              className="mb-6 rounded-2xl border flex items-center gap-3 px-5 py-4"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.35)",
              }}
            >
              <AlertTriangle size={18} color={C.red} />
              <div className="flex-1 text-sm text-red-200">{loadError}</div>
              <button
                onClick={loadPortfolio}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div
              className="rounded-2xl border flex flex-col items-center justify-center py-20 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: C.cardBorder,
              }}
            >
              <Loader2 size={28} className="animate-spin text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm font-medium">
                Loading your portfolio…
              </p>
            </div>
          ) : (
            <>
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
                          style={{
                            borderColor: C.cardBorder,
                            color: "#6b7280",
                          }}
                        >
                          <th className="px-5 py-3 font-medium">Stock</th>
                          <th className="px-5 py-3 font-medium">Quantity</th>
                          <th className="px-5 py-3 font-medium">Buy Price</th>
                          <th className="px-5 py-3 font-medium">Current</th>
                          <th className="px-5 py-3 font-medium">Invested</th>
                          <th className="px-5 py-3 font-medium">P/L(%)</th>
                          <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHoldings.map((h) => {
                          let plPos = h.pl >= 0;
                          return (
                            <tr
                              key={h.assetId || h.ticker}
                              className="border-b last:border-0 transition"
                              style={{ borderColor: C.cardBorder }}
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
                              <td className="px-5 py-4 text-gray-300 text-center">
                                {h.qty}
                              </td>
                              <td className="px-5 py-4 text-gray-300">
                                {formatUSD(h.buy)}
                              </td>
                              <td className="px-5 py-4 text-gray-300">
                                {formatUSD(h.current)}
                              </td>
                              <td className="px-5 py-4 text-gray-300">
                                {formatUSD(h.invested)}
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
                                  {h.pl?.toFixed(2)}%
                                </div>
                                <div
                                  className="text-xs mt-0.5"
                                  style={{
                                    color: plPos ? "#6ee7b7" : "#fca5a5",
                                    opacity: 0.75,
                                  }}
                                >
                                  {plPos ? "+" : ""}
                                  {formatUSD(
                                    h.plAmount ?? (h.invested * h.pl) / 100,
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4 flex">
                                <div className="flex justify-center gap-4">
                                  <button
                                    onClick={() =>
                                      handleAddToWatchlist(h.assetId)
                                    }
                                    title="Add to watchlist"
                                    className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-yellow-400 hover:bg-white/10 transition"
                                  >
                                    <Star
                                      size={13}
                                      fill={
                                        watchlist.has(h.assetId)
                                          ? "#F5A623"
                                          : "none"
                                      }
                                    />
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
                          <div className="text-xs text-gray-500 mb-1">
                            {label}
                          </div>
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
            </>
          )}
        </main>
      </div>
    </>
  );
}
