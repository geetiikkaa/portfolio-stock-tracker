import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";
import {
    Search,
    Bell,
    Moon,
    Power,
    ChevronDown,
    ArrowUpRight,
    Star,
} from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";

const C = {
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

const cardStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), #11162A",
    border: `1px solid ${C.cardBorder}`,
    borderRadius: "20px",
    boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
};

const perfData = [
    { month: "Jan", value: 14.1 },
    { month: "Feb", value: 15.6 },
    { month: "Mar", value: 14.6 },
    { month: "Apr", value: 17.8 },
    { month: "May", value: 24.75 },
    { month: "Jun", value: 22.9 },
];

const spark = (base, variance) =>
    Array.from({ length: 10 }, (_, i) => ({
        i,
        v: base + Math.sin(i * 1.3) * variance + i * (variance / 4),
    }));

const sparkPortfolio = spark(10, 3);
const sparkProfit = spark(8, 4);
const sparkNifty = spark(10, 2.5);
const sparkSensex = spark(10, 2);
const sparkNasdaq = spark(10, 2.8);

const donutData = [
    { name: "Equity", value: 65, color: C.blue },
    { name: "Mutual Funds", value: 20, color: C.teal },
    { name: "Crypto", value: 10, color: C.orange },
    { name: "Cash", value: 5, color: C.lavender },
];

const transactions = [
    {
        symbol: "AAPL",
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

const indices = [
    { name: "NIFTY 50", value: "22,302.50", change: "+1.25%", spark: sparkNifty },
    { name: "SENSEX", value: "73,525.45", change: "+1.08%", spark: sparkSensex },
    { name: "NASDAQ", value: "18,567.19", change: "+1.35%", spark: sparkNasdaq },
];

function Sparkline({ data, color, height = 40, width = 90 }) {
    const id = React.useId().replace(/:/g, "");
    return (
        <div style={{ width, height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#sg-${id})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function StatCard({ label, value, sub, subColor, spark: data, sparkColor, right }) {
    return (
        <div style={cardStyle} className="p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs" style={{ color: C.muted }}>
                        {label}
                    </div>
                    <div className="text-2xl font-bold mt-2" style={{ color: C.text }}>
                        {value}
                    </div>
                </div>
                {data && <Sparkline data={data} color={sparkColor} />}
                {right}
            </div>
            {sub && (
                <div className="flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: subColor }}>
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                    {sub}
                </div>
            )}
        </div>
    );
}

function HealthGauge({ score = 85 }) {
    const r = 34;
    const c = 2 * Math.PI * r;
    const offset = c - (score / 100) * c;
    return (
        <div className="relative" style={{ width: 88, height: 88 }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
                <circle
                    cx="44"
                    cy="44"
                    r={r}
                    fill="none"
                    stroke={C.green}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    transform="rotate(-90 44 44)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Star size={20} fill={C.green} color={C.green} strokeWidth={1} />
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div
            style={{
                background: "#1A2036",
                border: `1px solid ${C.cardBorder}`,
                borderRadius: "10px",
                padding: "8px 12px",
            }}
        >
            <div className="text-xs" style={{ color: C.muted }}>
                {label} 2024
            </div>
            <div className="text-sm font-semibold" style={{ color: C.text }}>
                ₹24,75,430
            </div>
        </div>
    );
}

function Dot(props) {
    const { cx, cy, index } = props;
    if (index !== 4) return null;
    return (
        <g>
            <circle cx={cx} cy={cy} r={6} fill={C.purple} stroke="#fff" strokeWidth={2} />
        </g>
    );
}

export default function Dashboard() {
    return (
        <>
            <PortfolioSidebar />
            <div
                className="w-full min-h-screen p-6"
                style={{
                    background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgBottom} 100%)`,
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

                {/* Top bar */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full flex-1 max-w-sm"
                        style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
                    >
                        <Search size={16} color={C.mutedSoft} />
                        <span className="text-sm" style={{ color: C.mutedSoft }}>
                            Search stocks, news, insights...
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {[Bell, Moon, Power].map((Icon, i) => (
                            <div
                                key={i}
                                className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
                            >
                                <Icon size={16} color={C.muted} />
                            </div>
                        ))}
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

                {/* Greeting */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-xl font-bold" style={{ color: C.text }}>
                            Good Morning, Geetika 👋
                        </div>
                        <div className="text-sm mt-1" style={{ color: C.muted }}>
                            Here's what's happening with your portfolio today.
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text }}
                    >
                        Today
                        <ChevronDown size={15} color={C.muted} />
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                    <StatCard
                        label="Total Portfolio Value"
                        value="₹24,75,430"
                        sub="+12.56% (All Time)"
                        subColor={C.green}
                        spark={sparkPortfolio}
                        sparkColor={C.green}
                    />
                    <StatCard
                        label="Today's Profit / Loss"
                        value="₹6,347.21"
                        sub="+2.35%"
                        subColor={C.green}
                        spark={sparkProfit}
                        sparkColor={C.green}
                    />
                    <StatCard label="Total Investment" value="₹18,45,000" />
                    <div style={cardStyle} className="p-5 flex items-center justify-between">
                        <div>
                            <div className="text-xs" style={{ color: C.muted }}>
                                Portfolio Health
                            </div>
                            <div className="text-2xl font-bold mt-2" style={{ color: C.text }}>
                                85/100
                            </div>
                            <div className="text-sm font-medium mt-1" style={{ color: C.green }}>
                                Excellent
                            </div>
                        </div>
                        <HealthGauge score={85} />
                    </div>
                </div>

                {/* Middle row */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div style={cardStyle} className="p-5 col-span-2">
                        <div className="text-sm font-semibold mb-2" style={{ color: C.text }}>
                            Portfolio Performance
                        </div>
                        <div style={{ height: 230 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={perfData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={C.purple} stopOpacity={0.45} />
                                            <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: C.mutedSoft, fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: C.mutedSoft, fontSize: 12 }}
                                        tickFormatter={(v) => `₹${v.toFixed(0)}L`}
                                        domain={[0, 30]}
                                        ticks={[0, 10, 20, 30]}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={C.purple}
                                        strokeWidth={2.5}
                                        fill="url(#perfFill)"
                                        dot={<Dot />}
                                        activeDot={{ r: 6, fill: C.purple, stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={cardStyle} className="p-5">
                        <div className="text-sm font-semibold mb-1" style={{ color: C.text }}>
                            Asset Allocation
                        </div>
                        <div className="flex items-center">
                            <div className="relative" style={{ width: 130, height: 130 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={42}
                                            outerRadius={62}
                                            paddingAngle={3}
                                            stroke="none"
                                        >
                                            {donutData.map((d, i) => (
                                                <Cell key={i} fill={d.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="text-sm font-bold" style={{ color: C.text }}>
                                        ₹24,75,430
                                    </div>
                                    <div className="text-xs" style={{ color: C.muted }}>
                                        Total
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2.5 ml-2">
                                {donutData.map((d) => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs">
                                        <span
                                            className="w-2 h-2 rounded-full inline-block"
                                            style={{ background: d.color }}
                                        />
                                        <span style={{ color: C.muted }}>{d.name}</span>
                                        <span className="font-semibold" style={{ color: C.text }}>
                                            {d.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-3 gap-4">
                    <div style={cardStyle} className="p-5 col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-semibold" style={{ color: C.text }}>
                                Recent Transactions
                            </div>
                            <div className="text-xs font-medium cursor-pointer" style={{ color: C.purple }}>
                                View All
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {transactions.map((t) => (
                                <div key={t.symbol} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                                            style={{ background: `${t.color}22`, color: t.color }}
                                        >
                                            {t.symbol.slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold" style={{ color: C.text }}>
                                                {t.symbol}{" "}
                                                <span className="font-normal" style={{ color: C.muted }}>
                                                    - {t.name}
                                                </span>
                                            </div>
                                            <div className="text-xs" style={{ color: C.muted }}>
                                                {t.action}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold" style={{ color: C.text }}>
                                            {t.amount}
                                        </div>
                                        <div className="text-xs" style={{ color: C.muted }}>
                                            {t.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={cardStyle} className="p-5">
                        <div className="text-sm font-semibold mb-3" style={{ color: C.text }}>
                            Market Snapshot
                        </div>
                        <div className="flex flex-col gap-4">
                            {indices.map((idx) => (
                                <div key={idx.name} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium" style={{ color: C.text }}>
                                            {idx.name}
                                        </div>
                                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                                            {idx.value}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkline data={idx.spark} color={C.green} width={60} height={28} />
                                        <span className="text-xs font-semibold" style={{ color: C.green }}>
                                            {idx.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
