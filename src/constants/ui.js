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
];
export const ASSET_TABS = [
    "All",
    "Equity",
    "ETF",
    "Crypto",
    "Cash"
]
export const TYPE_FILTERS = ["All", "Buy", "Sell", "Deposit", "Withdrawal"];
export const TIME_RANGES = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "All Time",
];
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
