import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PortfolioSidebar from "./PortfolioSidebar";
import { Link } from "react-router-dom";
import { cardStyle, C } from "../constants/ui";
import { formatUSD, spark } from "../utils/utils";
import Dot from "./ui/Dot";
import Sparkline from "./ui/Sparkline";
import StatCard from "./ui/StatCard";
import HealthGauge from "./ui/HealthGauge";
import TopBar from "./ui/TopBar";
import CustomTooltip from "./ui/CustomToolTip";
import TimeRangeDropdown from "./ui/TimeRangeDropdown";
import AssetAllocationChart from "./ui/AssetAllocationChart";
import EmptyState from "./ui/EmptyState";
import { useSelector } from "react-redux";
import axios from "axios";
import { getTickerColor } from "./ui/TransactionRow";

function ViewAll({ to }) {
  return (
    <Link
      className="text-xs font-medium cursor-pointer"
      style={{ color: C.purple }}
      to={to}
    >
      View All
    </Link>
  );
}

let TOKEN = localStorage.getItem("token");
let BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Dashboard() {
  let user = useSelector((state) => state.auth.user);
  let [searchQuery, setSearchQuery] = useState("");
  let [selectedRange, setSelectedRange] = useState("This Year");
  let query = searchQuery.trim().toLowerCase();
  let [recentTransactions, setRecentTransactions] = useState([]);
  let [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  let [marketIndices, setMarketIndices] = useState([]);
  let [isIndicesLoading, setIsIndicesLoading] = useState(true);
  let [portfolio, setPortfolio] = useState(null);
  let [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [portfolioGrowth, setPortfolioGrowth] = useState([]);
  const [isGrowthLoading, setIsGrowthLoading] = useState(true);
  const summary = portfolio?.summary;
  const currentValue = summary?.currentValue ?? 0;
  const totalInvestment = summary?.totalInvestment ?? 0;
  const totalProfitLoss = summary?.totalProfitLoss ?? 0;
  const isProfit = totalProfitLoss >= 0;
  const pnlSpark = useMemo(() => spark(8, 4), []);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setIsPortfolioLoading(true);

        const { data } = await axios.get(`${BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          withCredentials: true,
        });

        setPortfolio(data.data);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  useEffect(() => {
    const loadMarketIndices = async () => {
      try {
        setIsIndicesLoading(true);

        const { data } = await axios.get(`${BASE_URL}/market/indices`);

        const indicesWithHistory = await Promise.all(
          data.data.map(async (index) => {
            try {
              const history = await axios.get(
                `${BASE_URL}/market/indices/${encodeURIComponent(index.symbol)}/history`,
                {
                  params: {
                    range: "1d",
                    interval: "5m",
                  },
                },
              );

              return {
                ...index,
                history: history.data.data,
              };
            } catch {
              return {
                ...index,
                history: [],
              };
            }
          }),
        );

        setMarketIndices(indicesWithHistory);
      } catch (error) {
        console.error("Failed to load market indices:", error);
      } finally {
        setIsIndicesLoading(false);
      }
    };

    loadMarketIndices();
  }, []);

  let filteredIndices = useMemo(() => {
    if (!query) return marketIndices;

    return marketIndices.filter(
      (index) =>
        index.name?.toLowerCase().includes(query) ||
        index.symbol?.toLowerCase().includes(query),
    );
  }, [query, marketIndices]);

  useEffect(() => {
    const loadRecentTransactions = async () => {
      try {
        setIsTransactionsLoading(true);

        const { data } = await axios.get(`${BASE_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        setRecentTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to load recent transactions:", error);
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    loadRecentTransactions();
  }, []);

  useEffect(() => {
    const loadPortfolioGrowth = async () => {
      try {
        setIsGrowthLoading(true);

        const rangeMap = {
          Today: "Today",
          "This Week": "This Week",
          "This Month": "This Month",
          "This Year": "This Year",
        };

        const range = rangeMap[selectedRange];

        const { data } = await axios.get(`${BASE_URL}/portfolio/growth`, {
          params: { range, page: "dashboard" },
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          withCredentials: true,
        });

        setPortfolioGrowth(
          data.data.portfolio.map((item) => ({
            ...item,
            label: new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            }),
          })),
        );
      } catch (error) {
        console.error("Failed to load portfolio growth:", error);
      } finally {
        setIsGrowthLoading(false);
      }
    };

    loadPortfolioGrowth();
  }, [selectedRange]);

  let recentTransactionRows = useMemo(() => {
    return recentTransactions.map((tx) => {
      const ticker = tx.ticker_snapshot || "";

      return {
        id: tx._id,
        symbol: ticker,
        name: tx.asset_id?.name || tx.name_snapshot || "",
        action: tx.quantity != null ? `${tx.type} - ${tx.quantity}` : tx.type,
        amount: formatUSD(tx.amount),
        time: new Date(tx.occurred_at).toLocaleDateString(),
        color: getTickerColor(ticker),
      };
    });
  }, [recentTransactions]);

  let filteredTransactions = useMemo(() => {
    if (!query) return recentTransactionRows;

    return recentTransactionRows.filter(
      (tx) =>
        tx.symbol.toLowerCase().includes(query) ||
        tx.name.toLowerCase().includes(query),
    );
  }, [query, recentTransactionRows]);

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
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .dashboard-search::placeholder { color: ${C.mutedSoft}; }
        `}</style>
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xl font-bold" style={{ color: C.text }}>
              Good Morning, {user.name} 👋
            </div>
            <div className="text-sm mt-1" style={{ color: C.muted }}>
              Here's what's happening with your portfolio today.
            </div>
          </div>
          <TimeRangeDropdown
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard
            label="Total Portfolio Value"
            value={isPortfolioLoading ? "Loading..." : formatUSD(currentValue)}
            sub={
              isPortfolioLoading
                ? undefined
                : `${isProfit ? "+" : ""}${formatUSD(totalProfitLoss)}`
            }
            subColor={isProfit ? C.green : C.red}
          />
          <StatCard
            label="Today's Profit / Loss"
            value={
              isPortfolioLoading
                ? "Loading..."
                : formatUSD(portfolio?.summary?.todayProfitLoss ?? 0)
            }
            sub={
              isPortfolioLoading
                ? ""
                : `${portfolio?.summary?.todayProfitLossPercent >= 0 ? "+" : ""}${
                    portfolio?.summary?.todayProfitLossPercent ?? 0
                  }%`
            }
            subColor={
              (portfolio?.summary?.todayProfitLoss ?? 0) >= 0 ? C.green : C.red
            }
            spark={pnlSpark}
            sparkColor={
              (portfolio?.summary?.todayProfitLoss ?? 0) >= 0 ? C.green : C.red
            }
          />
          <StatCard
            label="Total Investment"
            value={
              isPortfolioLoading ? "Loading..." : formatUSD(totalInvestment)
            }
          />
          <div
            style={cardStyle}
            className="p-5 flex items-center justify-between"
          >
            <div>
              <div className="text-xs" style={{ color: C.muted }}>
                Portfolio Health
              </div>
              <div
                className="text-2xl font-bold mt-2"
                style={{ color: C.text }}
              >
                85/100
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: C.green }}
              >
                Excellent
              </div>
            </div>
            <HealthGauge score={85} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div style={cardStyle} className="p-5 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold" style={{ color: C.text }}>
                Portfolio Performance
              </div>
              <div className="text-xs" style={{ color: C.muted }}>
                {selectedRange}
              </div>
            </div>
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={portfolioGrowth}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={C.purple}
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="100%"
                        stopColor={C.purple}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.mutedSoft, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.mutedSoft, fontSize: 12 }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={C.purple}
                    strokeWidth={2.5}
                    fill="url(#perfFill)"
                    dot={(props) => (
                      <Dot {...props} total={portfolioGrowth.length} />
                    )}
                    activeDot={{
                      r: 6,
                      fill: C.purple,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <AssetAllocationChart
            holdings={portfolio?.holdings || []}
            isLoading={isPortfolioLoading}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 items-start">
          <div style={cardStyle} className="p-5 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold" style={{ color: C.text }}>
                Recent Transactions
              </div>
              <ViewAll to="/transactions" />
            </div>
            <div className="flex flex-col gap-4">
              {filteredTransactions.length === 0 ? (
                <EmptyState
                  searchQuery={searchQuery}
                  text={`No transactions match "${searchQuery}"`}
                />
              ) : (
                filteredTransactions.map((t) => (
                  <div
                    key={t.symbol}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ background: `${t.color}22`, color: t.color }}
                      >
                        {t.symbol.slice(0, 1)}
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: C.text }}
                        >
                          {t.symbol}
                          <span
                            className="font-normal"
                            style={{ color: C.muted }}
                          >
                            - {t.name}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: C.muted }}>
                          {t.action}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: C.text }}
                      >
                        {t.amount}
                      </div>
                      <div className="text-xs" style={{ color: C.muted }}>
                        {t.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div style={cardStyle} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-sm font-semibold mb-3"
                style={{ color: C.text }}
              >
                Market Snapshot
              </div>
              <ViewAll to="/market-overview" />
            </div>
            <div className="flex flex-col gap-4">
              {isIndicesLoading ? (
                <div
                  className="text-sm text-center py-6"
                  style={{ color: C.muted }}
                >
                  Loading market data...
                </div>
              ) : filteredIndices.length === 0 ? (
                <EmptyState text={`No indices match "${searchQuery}"`} />
              ) : (
                filteredIndices.slice(0, 3).map((index) => {
                  const positive = index.percentChange >= 0;
                  const changeColor = positive ? C.green : C.red;

                  return (
                    <div
                      key={index.symbol}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: C.text }}
                        >
                          {index.name}
                        </div>

                        <div
                          className="text-xs mt-0.5"
                          style={{ color: C.muted }}
                        >
                          {index.currency === "INR" ? "₹" : "$"}
                          {index.currentPrice}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Sparkline
                          data={index.history || []}
                          color={changeColor}
                          width={70}
                          height={26}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: changeColor }}
                        >
                          {positive ? "+" : ""}
                          {index.percentChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
