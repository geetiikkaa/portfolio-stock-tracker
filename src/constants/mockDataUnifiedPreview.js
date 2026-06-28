import {
  C as COLORS,
  inr,
} from "./mockData";

// -------------------------
// 1) Instruments / assets
// -------------------------
export const INSTRUMENTS = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    initial: "AP",
    color: "#8c4a3a",
    assetClass: "Equity",
    unitLabel: "Shares",
  },
  {
    ticker: "RELIANCE",
    name: "Reliance Ind.",
    initial: "RE",
    color: "#3a4a8c",
    assetClass: "Equity",
    unitLabel: "Shares",
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy",
    initial: "TC",
    color: "#1f5c4f",
    assetClass: "Equity",
    unitLabel: "Shares",
  },
  {
    ticker: "INFY",
    name: "Infosys Ltd.",
    initial: "IN",
    color: "#1565c0",
    assetClass: "Equity",
    unitLabel: "Shares",
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    initial: "HD",
    color: "#8c1c1c",
    assetClass: "Equity",
    unitLabel: "Shares",
  },
  {
    ticker: "BTC",
    name: "Bitcoin",
    initial: "₿",
    color: "#a3650f",
    assetClass: "Crypto",
    unitLabel: "BTC",
  },
  {
    ticker: "ABCF",
    name: "Axis Bluechip Fund",
    initial: "AB",
    color: "#2f6b5e",
    assetClass: "Mutual Funds",
    unitLabel: "Units",
  },
  {
    ticker: "CASH",
    name: "Wallet",
    initial: "₹",
    color: "#3a3a4a",
    assetClass: "Cash",
    unitLabel: "",
  },
];

export const instrumentByTicker = Object.fromEntries(
  INSTRUMENTS.map((i) => [i.ticker, i]),
);

// -------------------------
// 2) Canonical transactions
// -------------------------
// Shape is aligned with `Transactions.jsx` (base dataset).
export const TRANSACTIONS = [
  {
    id: 1,
    ticker: "AAPL",
    type: "Buy",
    qty: 10,
    amount: 21250,
    date: "2h ago",
    status: "Completed",
  },
  {
    id: 2,
    ticker: "RELIANCE",
    type: "Buy",
    qty: 5,
    amount: 12890,
    date: "5h ago",
    status: "Completed",
  },
  {
    id: 3,
    ticker: "TCS",
    type: "Buy",
    qty: 8,
    amount: 18190,
    date: "1d ago",
    status: "Completed",
  },
  {
    id: 4,
    ticker: "INFY",
    type: "Sell",
    qty: 4,
    amount: 6720,
    date: "2d ago",
    status: "Completed",
  },
  {
    id: 5,
    ticker: "HDFCBANK",
    type: "Buy",
    qty: 6,
    amount: 9000,
    date: "3d ago",
    status: "Pending",
  },
  {
    id: 6,
    ticker: "BTC",
    type: "Buy",
    qty: 0.05,
    amount: 215000,
    date: "3d ago",
    status: "Completed",
  },
  {
    id: 7,
    ticker: "ABCF",
    type: "Buy",
    qty: 25,
    amount: 12500,
    date: "4d ago",
    status: "Completed",
  },
  {
    id: 8,
    ticker: "AAPL",
    type: "Sell",
    qty: 2,
    amount: 4250,
    date: "4d ago",
    status: "Completed",
  },
  {
    id: 9,
    ticker: "CASH",
    type: "Deposit",
    qty: null,
    amount: 5000,
    date: "6d ago",
    status: "Completed",
  },
  {
    id: 10,
    ticker: "CASH",
    type: "Withdrawal",
    qty: null,
    amount: 2000,
    date: "1w ago",
    status: "Completed",
  },
];

// -------------------------
// 3) Enriched transactions
// -------------------------
export const TRANSACTIONS_ENRICHED = TRANSACTIONS.map((t) => {
  const inst = instrumentByTicker[t.ticker];
  return {
    id: t.id,
    ticker: t.ticker,
    name: inst?.name ?? t.ticker,
    initial: inst?.initial ?? t.ticker.slice(0, 2).toUpperCase(),
    color: inst?.color ?? "#888",
    assetClass: inst?.assetClass ?? "Equity",
    type: t.type,
    qty: t.qty,
    unitLabel:
      inst?.assetClass === "Mutual Funds"
        ? "Units"
        : inst?.assetClass === "Crypto"
          ? (inst?.ticker ?? t.ticker).toUpperCase()
          : inst?.unitLabel ?? "Shares",
    amount: t.amount,
    date: t.date,
    status: t.status,
  };
});

// -------------------------
// 4) Portfolio holdings (derived)
// -------------------------
// Deterministic preview computation:
// - qty is derived from Buy/Sell for non-CASH instruments
// - cash balance derived from Deposit/Withdrawal
// - current value and invested value use a simple fixed pricing model
const FIXED_PRICES = {
  AAPL: 2125,
  RELIANCE: 2890,
  TCS: 4150,
  INFY: 1680,
  HDFCBANK: 1750,
  BTC: 4300000,
  ABCF: 500,
  CASH: 1,
};

export function computeHoldingsFromTransactions(transactionsEnriched) {
  const qtyByTicker = {};
  const cashNet = {
    CASH: 0,
  };

  for (const t of transactionsEnriched) {
    if (t.ticker === "CASH") {
      if (t.type === "Deposit") cashNet.CASH += t.amount;
      if (t.type === "Withdrawal") cashNet.CASH -= t.amount;
      continue;
    }

    if (t.type === "Buy") qtyByTicker[t.ticker] = (qtyByTicker[t.ticker] ?? 0) + (t.qty ?? 0);
    if (t.type === "Sell") qtyByTicker[t.ticker] = (qtyByTicker[t.ticker] ?? 0) - (t.qty ?? 0);
  }

  const holdings = [];
  for (const inst of INSTRUMENTS) {
    const ticker = inst.ticker;

    if (ticker === "CASH") {
      const invested = 0; // preview-only; UI can still show a cash block
      const current = cashNet.CASH;
      const plPct = invested > 0 ? ((current - invested) / invested) * 100 : current >= 0 ? 100 : -100;
      holdings.push({
        ticker,
        name: inst.name,
        initial: inst.initial,
        color: inst.color,
        qty: null,
        buy: 0,
        current,
        invested,
        pl: plPct,
        assetClass: inst.assetClass,
      });
      continue;
    }

    const qty = qtyByTicker[ticker] ?? 0;
    // Invested approximation: sum of buy amounts for the ticker minus sell amounts.
    const invested = transactionsEnriched
      .filter((x) => x.ticker === ticker)
      .reduce((sum, x) => {
        if (x.type === "Buy" || x.type === "Deposit") return sum + x.amount;
        if (x.type === "Sell" || x.type === "Withdrawal") return sum - x.amount;
        return sum;
      }, 0);

    const current = (FIXED_PRICES[ticker] ?? 0) * qty;
    const plPct = invested !== 0 ? ((current - invested) / invested) * 100 : current >= 0 ? 100 : -100;

    holdings.push({
      ticker,
      name: inst.name,
      initial: inst.initial,
      color: inst.color,
      qty,
      buy: invested / (qty || 1),
      current,
      invested,
      pl: plPct,
      assetClass: inst.assetClass,
    });
  }

  return holdings;
}

export const PORTFOLIO_HOLDINGS = computeHoldingsFromTransactions(
  TRANSACTIONS_ENRICHED,
);

// -------------------------
// 5) Market snapshot (preview)
// -------------------------
// For pages like Watchlist/MarketOverview.
// This is preview-only; meant to be replaceable with derived values later.
export const MARKET_SNAPSHOT = {
  indices: [
    {
      name: "NIFTY 50",
      value: "22,302.50",
      change: "+1.25%",
    },
    {
      name: "SENSEX",
      value: "73,525.45",
      change: "+1.08%",
    },
    {
      name: "NASDAQ",
      value: "18,567.19",
      change: "+1.35%",
    },
    {
      name: "BANK NIFTY",
      value: "48,125.30",
      change: "+1.46%",
    },
  ],
  movers: {
    gainers: [
      { stock: "NVDA", price: 1195.55, change: 8.24 },
      { stock: "ADANIENT", price: 3245.6, change: 6.35 },
      { stock: "TITAN", price: 3408.5, change: 5.21 },
      { stock: "WIPRO", price: 512.35, change: 4.25 },
      { stock: "COALINDIA", price: 542.6, change: 3.98 },
      { stock: "TATAMOTORS", price: 945.2, change: 3.72 },
    ],
    losers: [
      { stock: "M&M", price: 2615.9, change: -3.25 },
      { stock: "BAJFINANCE", price: 6026.25, change: -2.45 },
      { stock: "NESTLEIND", price: 2150.15, change: -2.1 },
      { stock: "MARUTI", price: 10250.3, change: -1.85 },
      { stock: "POWERGRID", price: 295.45, change: -1.65 },
      { stock: "HINDUNILVR", price: 2480.7, change: -1.52 },
    ],
  },
  news: [
    { title: "RBI keeps repo rate unchanged", time: "2h ago" },
    { title: "Global markets rally ahead of US CPI data", time: "4h ago" },
    { title: "Oil prices rise on supply concerns", time: "6h ago" },
    { title: "IT sector stocks surge on strong earnings", time: "8h ago" },
    { title: "Rupee strengthens against the dollar", time: "10h ago" },
    { title: "FIIs turn net buyers in Indian equities", time: "12h ago" },
  ],
};

// -------------------------
// 6) Helpful utilities for wiring
// -------------------------
export function toDashboardRecentTransactions(txsEnriched) {
  // Dashboard expects: symbol, action, amount (string), time, color, name.
  return txsEnriched.map((t) => {
    const typeLabel = t.type === "Buy" ? "Buy" : t.type === "Sell" ? "Sell" : t.type;
    const action =
      t.assetClass === "Cash" || !t.qty
        ? `${typeLabel}`
        : `${typeLabel} ${t.qty} ${t.unitLabel}`;

    return {
      symbol: t.ticker,
      name: t.name,
      action,
      amount: typeof t.amount === "number" ? inr(t.amount) : t.amount,
      time: t.date,
      color: t.color,
    };
  });
}

// Optional: if later you want watchlist rows derived from instruments.
export function toWatchlistStocksFromInstruments(instruments) {
  // Preview-only: fabricate price/change consistently from the fixed price model.
  return instruments
    .filter((i) => i.ticker !== "CASH")
    .map((i, idx) => {
      const price = FIXED_PRICES[i.ticker] ?? 100;
      const change = (idx % 2 === 0 ? 1 : -1) * (0.85 + (idx % 5) * 0.55);
      return {
        id: idx + 1,
        ticker: i.ticker,
        name: i.name,
        initial: i.initial,
        color: i.color,
        price: price,
        change: change,
        favourite: idx % 3 === 0,
        trending: idx % 2 === 0,
        spark: Array.from({ length: 10 }, (_, j) => ({
          i: j,
          v:
            change >= 0
              ? 10 + j * 1.4 + Math.sin(j * 1.3) * 2
              : 22 - j * 1.4 + Math.sin(j * 1.3) * 2,
        })),
      };
    });
}

export const PREVIEW_META = {
  note: "Do not integrate automatically. Use this as a reference for a unified mock model.",
  sources: {
    derivedFrom: ["INSTRUMENTS", "TRANSACTIONS"],
    transactionsShapeAlignedTo: "src/component/Transactions.jsx",
  },
  colors: {
    primary: COLORS.purple,
    green: COLORS.green,
    red: COLORS.red,
    blue: COLORS.blue,
  },
};

