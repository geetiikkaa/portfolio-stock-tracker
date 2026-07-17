export let toggleSeries = (key, setVisibleSeries) =>
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));

export let formatPct = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

export function formatTick(date, range) {
    if (range === "1M") {
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    }
    if (range === "All") {
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
        });
    }
    return date.toLocaleDateString("en-US", { month: "short" });
}

export let formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

function hoursAgo(label) {
    let match = /^(\d+)([hdw])\s+ago$/.exec(label || "");
    if (!match) return 0;
    let [, num, unit] = match;
    let n = Number(num);
    if (unit === "h") return n;
    if (unit === "d") return n * 24;
    if (unit === "w") return n * 24 * 7;
    return 0;
}

let CURRENT_PRICES = {
    AAPL: 2380,
    RELIANCE: 2890,
    TCS: 4150,
    INFY: 1680,
    HDFCBANK: 1750,
    BTC: 4500000,
    ABCF: 520,
};

export function buildHoldings(transactions, priceOverrides = {}) {
    let map = new Map();

    [...transactions]
        .filter((tx) => tx.status === "Completed" && tx.assetClass !== "Cash")
        .sort((a, b) => hoursAgo(b.date) - hoursAgo(a.date)) // oldest first
        .forEach((tx) => {
            let key = tx.ticker;

            if (!map.has(key)) {
                map.set(key, {
                    ticker: tx.ticker,
                    name: tx.name,
                    initial: tx.initial,
                    color: tx.color,
                    assetClass: tx.assetClass,
                    unitLabel: tx.unitLabel,
                    qty: 0,
                    invested: 0,
                });
            }

            let h = map.get(key);

            if (tx.type === "Buy") {
                h.qty += tx.qty;
                h.invested += tx.amount;
            }
            if (tx.type === "Sell") {
                // Reduce invested by the average cost of the shares being
                // sold, not by the sale proceeds — otherwise a profitable
                // sale distorts the P/L of the shares you still hold.
                let avgCost = h.qty > 0 ? h.invested / h.qty : 0;
                h.qty -= tx.qty;
                h.invested -= avgCost * tx.qty;
            }
        });

    return Array.from(map.values())
        .filter((h) => h.qty > 0)
        .map((h) => {
            let current = priceOverrides[h.ticker] ?? CURRENT_PRICES[h.ticker] ?? 0;
            let currentValue = h.qty * current;
            let pl = h.invested
                ? ((currentValue - h.invested) / h.invested) * 100
                : 0;

            return {
                ...h,
                buy: h.invested / h.qty,
                current,
                pl,
            };
        });
}

export let spark = (
    points = 24,
    { start = 100, drift = 0.35, volatility = 3 } = {},
) => {
    let value = start;

    return Array.from({ length: points }, (_, i) => {
        let change = drift + (Math.random() - 0.5) * volatility * 2;

        if (Math.random() < 0.2) {
            change += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 5);
        }

        value += change;

        return {
            i,
            v: value,
        };
    });
};
export function trendSpark(direction, points = 24) {
    let value = direction === "up" ? 40 : 60;

    let drift = direction === "up" ? 0.4 : -0.4;

    return Array.from({ length: points }, (_, i) => {
        value += drift + (Math.random() - 0.5) * 4;

        return {
            i,
            v: value,
        };
    });
}