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

export const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
    { label: "Watchlist", icon: Star, path: "/watchlist" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Market Overview", icon: TrendingUp, path: "/market-overview" },
    { label: "Goals", icon: Target, path: "/goals" },
    { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
    // { label: "Notifications", icon: Bell, path: "/notifications" },
    // { label: "Settings", icon: Settings, path: "/settings" },
];

export const ASSET_TABS = ["All", "Equity", "Mutual Funds", "Crypto", "Cash"];
export const TYPE_FILTERS = ["All", "Buy", "Sell", "Deposit", "Withdrawal"];

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
        status: "Completed",
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
        status: "Completed",
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
];

export const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

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
export const emptyForm = {
    name: "",
    ticker: "",
    assetClass: "Equity",
    type: "Buy",
    qty: "",
    amount: "",
};
export const TIME_RANGES = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "All Time",
];
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
export const donutData = [
    { name: "Equity", value: 65, color: C.blue },
    { name: "Mutual Funds", value: 20, color: C.teal },
    { name: "Crypto", value: 10, color: C.orange },
    { name: "Cash", value: 5, color: C.lavender },
];
export const transactions = [
    {
        symbol: "APPLE",
        name: "Apple Inc.",
        action: "Buy 10 Shares",
        amount: "₹21,250",
        time: "2h ago",
        color: C.red,
    },
    {
        symbol: "RELIANCE",
        name: "Reliance Ind.",
        action: "Buy 5 Shares",
        amount: "₹12,890",
        time: "5h ago",
        color: C.blue,
    },
    {
        symbol: "TCS",
        name: "Tata Consultancy",
        action: "Buy 8 Shares",
        amount: "₹18,190",
        time: "1d ago",
        color: C.teal,
    },
];
export const RANGE_OPTIONS = ["1M", "3M", "6M", "1Y", "All"];
export const RANGE_DAYS = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365, All: 730 };
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

    // Anchor so that exactly one year back from today reads  -12% / -8%,
    // matching the reference chart's starting point for the 1Y view.
    const anchorIdx = Math.max(0, raw.length - 365);
    const shiftP = -12 - raw[anchorIdx].portfolio;
    const shiftN = -8 - raw[anchorIdx].nifty;

    return raw.map((d) => ({
        ...d,
        portfolio: Math.round((d.portfolio + shiftP) * 10) / 10,
        nifty: Math.round((d.nifty + shiftN) * 10) / 10,
    }));
}
export const COLORS = {
    pageBg: "#070b14",
    card: "#0b1020",
    cardBorder: "#1b2236",
    grid: "#1a2236",
    axisText: "#5b6478",
    purple: "#7c6ef6", // "Your Portfolio" line / active pill / equity
    purpleSoft: "#4c46b8",
    green: "#34d399", // "NIFTY 50" line / positive metrics
    red: "#f87171", // negative metrics
    orange: "#f97316", // crypto slice
    violet: "#a855f7", // mutual funds slice
    gray: "#94a3b8", // cash slice
};
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
export const ALLOCATION = [
    { name: "Equity", value: 1361490, color: COLORS.purple },
    { name: "Mutual Funds", value: 495085, color: COLORS.violet },
    { name: "Crypto", value: 371315, color: COLORS.orange },
    { name: "Cash", value: 247540, color: COLORS.gray },
];