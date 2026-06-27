import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import { C, cardStyle } from "../constants/mockData";

const TABS = ["All Holdings", "Equity", "Mutual Funds", "Crypto", "Cash"];

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

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("All Holdings");

  const totalInvestment = HOLDINGS.reduce((sum, h) => sum + h.invested, 0);
  const currentValue = HOLDINGS.reduce(
    (sum, h) => sum + h.invested * (1 + h.pl / 100),
    0,
  );
  const totalProfit = currentValue - totalInvestment;
  const totalProfitPct = (totalProfit / totalInvestment) * 100;

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] flex text-white">
      {/* Sidebar */}
      <PortfolioSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition">
              <Plus size={16} />
              Add New
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

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/10 mb-5">
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
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border border-white/10  overflow-hidden"
          style={{ background: cardStyle.background }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide border-b border-white/10">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Buy Price</th>
                <th className="px-5 py-3 font-medium">Current Price</th>
                <th className="px-5 py-3 font-medium">Invested</th>
                <th className="px-5 py-3 font-medium">P/L (%)</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h) => (
                <tr
                  key={h.ticker}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: h.color }}
                      >
                        {h.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {h.ticker}
                        </div>
                        <div className="text-xs text-gray-500">{h.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{h.qty}</td>
                  <td className="px-5 py-4 text-gray-300">{inr(h.buy)}</td>
                  <td className="px-5 py-4 text-gray-300">{inr(h.current)}</td>
                  <td className="px-5 py-4 text-gray-300">{inr(h.invested)}</td>
                  <td className="px-5 py-4 font-medium text-emerald-400">
                    +{h.pl.toFixed(2)}%
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition">
                        <Pencil size={13} />
                      </button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div
          className="mt-6 rounded-2xl border border-white/10 px-8 py-5 flex items-center justify-between flex-wrap gap-6"
          style={cardStyle}
        >
          <div>
            <div className="text-xs text-gray-500 mb-1">Total Investment</div>
            <div className="text-base font-semibold text-white">
              {inr(Math.round(totalInvestment))}
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="text-xs text-gray-500 mb-1">Current Value</div>
            <div className="text-base font-semibold text-white">
              {inr(Math.round(currentValue))}
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="text-xs text-gray-500 mb-1">
              Total Profit / Loss
            </div>
            <div className="text-base font-semibold text-emerald-400">
              +{inr(Math.round(totalProfit))} (+{totalProfitPct.toFixed(2)}%)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
