import {
    LayoutDashboard,
    Briefcase,
    Star,
    BarChart3,
    TrendingUp,
    ArrowLeftRight,
    Target,
} from "lucide-react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { spark, trendSpark } from "../utils/utils";

export const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
    { label: "Watchlist", icon: Star, path: "/watchlist" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Market Overview", icon: TrendingUp, path: "/market-overview" },
    { label: "Goals", icon: Target, path: "/goals" },
    { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
];

export const ASSET_TABS = ["All", "Equity", "Mutual Funds", "Crypto", "Cash"];
export const TYPE_FILTERS = ["All", "Buy", "Sell", "Deposit", "Withdrawal"];
export const TIME_RANGES = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "All Time",
];
export const C = {
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
    blue: "#5B72F0",
    teal: "#2BCB8E",
    orange: "#F5A623",
    lavender: "#B49CF5",
};
export const cardStyle = {
    background:
        "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), #11162A",
    border: `1px solid ${C.cardBorder}`,
    borderRadius: "20px",
    boxShadow:
        "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
};
export const COLORS = {
    pageBg: "#070b14",
    card: "#0b1020",
    cardBorder: "#1b2236",
    grid: "#1a2236",
    axisText: "#5b6478",
    purple: "#7c6ef6",
    purpleSoft: "#4c46b8",
    green: "#34d399",
    red: "#f87171",
    orange: "#f97316",
    violet: "#a855f7",
    gray: "#94a3b8",
};
export const INITIAL_PROFILE = {
    name: "Geetika Pandey",
    email: "geetika@example.com",
    phone: "+91 98765 43210",
    location: "India",
    memberSince: "May 2024",
    plan: "Premium Member",
    avatar: null,
};
export const emptyForm = {
    name: "",
    ticker: "",
    assetClass: "Equity",
    type: "Buy",
    qty: "",
    amount: "",
};
export const TYPE_STYLES = {
    Buy: {
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        icon: ArrowDownLeft,
    },
    Sell: { color: "text-rose-400", bg: "bg-rose-500/10", icon: ArrowUpRight },
    Deposit: {
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        icon: ArrowDownLeft,
    },
    Withdrawal: {
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        icon: ArrowUpRight,
    },
};

export const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const RANGE_DATA = {
    Today: {
        data: [
            { label: "9AM", value: 24.12 },
            { label: "11AM", value: 24.28 },
            { label: "1PM", value: 24.05 },
            { label: "3PM", value: 24.41 },
            { label: "5PM", value: 24.75 },
        ],
        changeLabel: "+0.42% (Today)",
    },
    "This Week": {
        data: [
            { label: "Mon", value: 23.85 },
            { label: "Tue", value: 24.05 },
            { label: "Wed", value: 23.78 },
            { label: "Thu", value: 24.3 },
            { label: "Fri", value: 24.55 },
            { label: "Sat", value: 24.68 },
            { label: "Sun", value: 24.75 },
        ],
        changeLabel: "+1.83% (This Week)",
    },
    "This Month": {
        data: [
            { label: "W1", value: 21.4 },
            { label: "W2", value: 22.1 },
            { label: "W3", value: 23.6 },
            { label: "W4", value: 24.75 },
        ],
        changeLabel: "+5.92% (This Month)",
    },
    "This Year": {
        data: [
            { label: "Jan", value: 14.1 },
            { label: "Feb", value: 15.6 },
            { label: "Mar", value: 14.6 },
            { label: "Apr", value: 17.8 },
            { label: "May", value: 24.75 },
            { label: "Jun", value: 22.9 },
        ],
        changeLabel: "+12.56% (This Year)",
    },
    "All Time": {
        data: [
            { label: "2021", value: 8.2 },
            { label: "2022", value: 11.5 },
            { label: "2023", value: 17.8 },
            { label: "2024", value: 24.75 },
        ],
        changeLabel: "+68.4% (All Time)",
    },
};
export const RANGE_OPTIONS = ["1M", "3M", "6M", "1Y", "All"];

export const RANGE_DAYS = {
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
    All: 730,
};
export function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}
export function generateGrowthSeries(totalDays) {
    const rand = seededRandom(7321);
    const today = new Date();
    const dayMs = 86400000;

    let portfolioRaw = 0;
    let niftyRaw = 0;
    const raw = [];

    for (let i = totalDays - 1; i >= 0; i--) {
        portfolioRaw += 0.137 + (rand() - 0.5) * 1.6;
        niftyRaw += 0.071 + (rand() - 0.5) * 1.3;
        raw.push({
            date: new Date(today.getTime() - i * dayMs),
            portfolio: portfolioRaw,
            nifty: niftyRaw,
        });
    }

    const anchorIdx = Math.max(0, raw.length - 365);
    const shiftP = -12 - raw[anchorIdx].portfolio;
    const shiftN = -8 - raw[anchorIdx].nifty;

    return raw.map((d) => ({
        ...d,
        portfolio: Math.round((d.portfolio + shiftP) * 10) / 10,
        nifty: Math.round((d.nifty + shiftN) * 10) / 10,
    }));
}
export const DONUT_DATA = [
    { name: "Equity", value: 65, color: COLORS.purple },
    { name: "Mutual Funds", value: 20, color: COLORS.violet },
    { name: "Crypto", value: 10, color: COLORS.orange },
    { name: "Cash", value: 5, color: COLORS.gray },
];

export const ALLOCATION = [
    { name: "Equity", value: 1361490, color: COLORS.purple },
    { name: "Mutual Funds", value: 495085, color: COLORS.violet },
    { name: "Crypto", value: 371315, color: COLORS.orange },
    { name: "Cash", value: 247540, color: COLORS.gray },
];

export const MONTHLY_RETURNS = [
    { month: "Jul", value: 5.6 },
    { month: "Aug", value: 1.4 },
    { month: "Sep", value: -2.8 },
    { month: "Oct", value: 6.9 },
    { month: "Nov", value: -1.6 },
    { month: "Dec", value: 2.2 },
    { month: "Jan", value: -4.35 },
    { month: "Feb", value: 3.1 },
    { month: "Mar", value: 8.25 },
    { month: "Apr", value: 2.4 },
    { month: "May", value: -1.1 },
    { month: "Jun", value: 1.8 },
];

export const INITIAL_TRANSACTIONS = [
    {
        id: 1,
        ticker: "AAPL",
        name: "Apple Inc.",
        initial: "AP",
        color: "#8c4a3a",
        assetClass: "Equity",
        type: "Buy",
        qty: 10,
        unitLabel: "Shares",
        amount: 21250,
        date: "2h ago",
        status: "Pending",
    },
    {
        id: 2,
        ticker: "RELIANCE",
        name: "Reliance Ind.",
        initial: "RE",
        color: "#3a4a8c",
        assetClass: "Equity",
        type: "Buy",
        qty: 5,
        unitLabel: "Shares",
        amount: 12890,
        date: "5h ago",
        status: "Completed",
    },
    {
        id: 3,
        ticker: "TCS",
        name: "Tata Consultancy",
        initial: "TC",
        color: "#1f5c4f",
        assetClass: "Equity",
        type: "Buy",
        qty: 8,
        unitLabel: "Shares",
        amount: 18190,
        date: "1d ago",
        status: "Completed",
    },
    {
        id: 4,
        ticker: "INFY",
        name: "Infosys Ltd.",
        initial: "IN",
        color: "#1565c0",
        assetClass: "Equity",
        type: "Sell",
        qty: 4,
        unitLabel: "Shares",
        amount: 6720,
        date: "2d ago",
        status: "Completed",
    },
    {
        id: 5,
        ticker: "HDFCBANK",
        name: "HDFC Bank",
        initial: "HD",
        color: "#8c1c1c",
        assetClass: "Equity",
        type: "Buy",
        qty: 6,
        unitLabel: "Shares",
        amount: 9000,
        date: "3d ago",
        status: "Pending",
    },
    {
        id: 6,
        ticker: "BTC",
        name: "Bitcoin",
        initial: "₿",
        color: "#a3650f",
        assetClass: "Crypto",
        type: "Buy",
        qty: 0.05,
        unitLabel: "BTC",
        amount: 215000,
        date: "3d ago",
        status: "Completed",
    },
    {
        id: 7,
        ticker: "ABCF",
        name: "Axis Bluechip Fund",
        initial: "AB",
        color: "#2f6b5e",
        assetClass: "Mutual Funds",
        type: "Buy",
        qty: 25,
        unitLabel: "Units",
        amount: 12500,
        date: "4d ago",
        status: "Pending",
    },
    {
        id: 8,
        ticker: "AAPL",
        name: "Apple Inc.",
        initial: "AP",
        color: "#8c4a3a",
        assetClass: "Equity",
        type: "Sell",
        qty: 2,
        unitLabel: "Shares",
        amount: 4250,
        date: "4d ago",
        status: "Completed",
    },
    {
        id: 9,
        ticker: "CASH",
        name: "Wallet Top-up",
        initial: "₹",
        color: "#3a3a4a",
        assetClass: "Cash",
        type: "Deposit",
        qty: null,
        unitLabel: "",
        amount: 5000,
        date: "6d ago",
        status: "Completed",
    },
    {
        id: 10,
        ticker: "CASH",
        name: "Wallet Withdrawal",
        initial: "₹",
        color: "#3a3a4a",
        assetClass: "Cash",
        type: "Withdrawal",
        qty: null,
        unitLabel: "",
        amount: 2000,
        date: "1w ago",
        status: "Completed",
    },
    {
        id: 11,
        ticker: "INFY",
        name: "Infosys Ltd.",
        initial: "IN",
        color: "#1565c0",
        assetClass: "Equity",
        type: "Buy",
        qty: 8,
        unitLabel: "Shares",
        amount: 12800,
        date: "9d ago",
        status: "Completed",
    },
];

export const CURRENT_PRICES = {
    AAPL: 2380,
    RELIANCE: 2890,
    TCS: 4150,
    INFY: 1680,
    HDFCBANK: 1750,
    BTC: 4500000,
    ABCF: 520,
};

function hoursAgo(label) {
    const match = /^(\d+)([hdw])\s+ago$/.exec(label);
    if (!match) return 0;
    const [, num, unit] = match;
    const n = Number(num);
    if (unit === "h") return n;
    if (unit === "d") return n * 24;
    if (unit === "w") return n * 24 * 7;
    return 0;
}

export function computeHoldings(
    transactions = INITIAL_TRANSACTIONS,
    currentPrices = CURRENT_PRICES
) {
    const byTicker = {};

    transactions
        .filter((t) => t.status === "Completed" && t.assetClass !== "Cash")
        .sort((a, b) => hoursAgo(b.date) - hoursAgo(a.date))
        .forEach((t) => {
            if (!byTicker[t.ticker]) {
                byTicker[t.ticker] = {
                    ticker: t.ticker,
                    name: t.name,
                    initial: t.initial,
                    color: t.color,
                    assetClass: t.assetClass,
                    unitLabel: t.unitLabel,
                    qty: 0,
                    invested: 0,
                };
            }
            const h = byTicker[t.ticker];

            if (t.type === "Buy") {
                h.qty += t.qty;
                h.invested += t.amount;
            } else if (t.type === "Sell") {
                const avgCost = h.qty > 0 ? h.invested / h.qty : 0;
                h.qty -= t.qty;
                h.invested -= avgCost * t.qty;
            }
        });

    return Object.values(byTicker)
        .filter((h) => h.qty > 0)
        .map((h) => {
            const buyPrice = h.invested / h.qty;
            const currentPrice = currentPrices[h.ticker] ?? buyPrice;
            const currentValue = currentPrice * h.qty;
            const pl = currentValue - h.invested;
            const plPct = h.invested !== 0 ? (pl / h.invested) * 100 : 0;

            return {
                ...h,
                buyPrice,
                currentPrice,
                invested: h.invested,
                currentValue,
                pl,
                plPct,
            };
        });
}
export const PORTFOLIO_HOLDINGS = computeHoldings();
export let INDEX_CARDS = [
    {
        name: "NIFTY 50",
        value: "22,302.50",
        change: "+1.25%",
        spark: spark(24, {
            start: 100,
            drift: 0.35,
            volatility: 4,
        }),
    },
    {
        name: "SENSEX",
        value: "73,525.45",
        change: "+1.08%",
        spark: spark(24, {
            start: 95,
            drift: 0.3,
            volatility: 4,
        }),
    },
    {
        name: "NASDAQ",
        value: "18,567.19",
        change: "+1.35%",
        spark: spark(24, {
            start: 110,
            drift: 0.5,
            volatility: 4,
        }),
    },
    {
        name: "BANK NIFTY",
        value: "48,125.30",
        change: "+1.46%",
        spark: spark(24, {
            start: 90,
            drift: 0.45,
            volatility: 4,
        }),
    },
];
export let TOP_GAINERS = [
    { stock: "NVDA", price: 1195.55, change: 8.24 },
    { stock: "ADANIENT", price: 3245.6, change: 6.35 },
    { stock: "TITAN", price: 3408.5, change: 5.21 },
    { stock: "WIPRO", price: 512.35, change: 4.25 },
    { stock: "COALINDIA", price: 542.6, change: 3.98 },
    { stock: "TATAMOTORS", price: 945.2, change: 3.72 },
    { stock: "ONGC", price: 268.15, change: 3.45 },
    { stock: "SBIN", price: 812.9, change: 3.1 },
    { stock: "AXISBANK", price: 1145.65, change: 2.88 },
    { stock: "ITC", price: 438.2, change: 2.55 },
];
export let TOP_LOSERS = [
    { stock: "M&M", price: 2615.9, change: -3.25 },
    { stock: "BAJFINANCE", price: 6026.25, change: -2.45 },
    { stock: "NESTLEIND", price: 2150.15, change: -2.1 },
    { stock: "MARUTI", price: 10250.3, change: -1.85 },
    { stock: "POWERGRID", price: 295.45, change: -1.65 },
    { stock: "HINDUNILVR", price: 2480.7, change: -1.52 },
    { stock: "ASIANPAINT", price: 2890.15, change: -1.38 },
    { stock: "BHARTIARTL", price: 1325.4, change: -1.2 },
    { stock: "KOTAKBANK", price: 1745.85, change: -1.05 },
    { stock: "ULTRACEMCO", price: 9875.6, change: -0.92 },
];
export let MARKET_NEWS = [
    { title: "RBI keeps repo rate unchanged", time: "2h ago" },
    { title: "Global markets rally ahead of US CPI data", time: "4h ago" },
    { title: "Oil prices rise on supply concerns", time: "6h ago" },
    { title: "IT sector stocks surge on strong earnings", time: "8h ago" },
    { title: "Rupee strengthens against the dollar", time: "10h ago" },
    { title: "FIIs turn net buyers in Indian equities", time: "12h ago" },
];
export let INITIAL_STOCKS = [
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
        sparkProps: {
            drift: 2.5,
            volatility: 1.4,
        },
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
        sparkProps: {
            drift: 2.0,
            volatility: 3.5,
        },
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
        sparkProps: {
            drift: 3.0,
            volatility: 2.8,
        },
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
        sparkProps: {
            drift: 1.5,
            volatility: 1.8,
        },
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
        sparkProps: {
            drift: 1.8,
            volatility: 2.0,
        },
    },
].map((s) => ({
    ...s,
    spark: trendSpark(s.change >= 0 ? "up" : "down", 24),
}));
export let indices = [
    {
        name: "NIFTY 50",
        value: "22,302.50",
        change: "+1.25%",
        spark: spark(10, 2.5),
    },
    { name: "SENSEX", value: "73,525.45", change: "+1.08%", spark: spark(10, 2) },
    {
        name: "NASDAQ",
        value: "18,567.19",
        change: "+1.35%",
        spark: spark(10, 2.8),
    },
];