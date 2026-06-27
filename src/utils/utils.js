export const toggleSeries = (key, setVisibleSeries) =>
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
export const formatPct = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
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
export const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);