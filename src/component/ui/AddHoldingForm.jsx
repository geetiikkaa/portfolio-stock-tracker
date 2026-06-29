import { useState } from "react";

const C = {
  text: "#F3F5FB",
  muted: "#8A91A8",
  cardBorder: "rgba(255,255,255,0.06)",
  blue: "#5B72F0",
  purple: "#8C7CF6",
};
const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), #11162A",
  border: `1px solid ${C.cardBorder}`,
  borderRadius: "20px",
  boxShadow:
    "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
};
const AVATAR_COLORS = [
  "#5B72F0",
  "#F0716B",
  "#2BCB8E",
  "#F5A623",
  "#8C7CF6",
  "#B49CF5",
];
const emptyForm = {
  ticker: "",
  name: "",
  qty: "",
  buy: "",
  current: "",
};

export default function AddHoldingForm() {
  const [form, setForm] = useState(emptyForm);
  const [holdings, setHoldings] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.ticker.trim() ||
      !form.name.trim() ||
      !form.qty ||
      !form.buy ||
      !form.current
    )
      return;

    const qty = Number(form.qty);
    const buy = Number(form.buy);
    const current = Number(form.current);

    const invested = qty * buy;
    const pl = buy > 0 ? ((current - buy) / buy) * 100 : 0;

    const newHolding = {
      id: Date.now(),
      ticker: form.ticker.trim().toUpperCase(),
      name: form.name.trim(),
      initial: form.ticker.trim()[0].toUpperCase(),
      color: AVATAR_COLORS[holdings.length % AVATAR_COLORS.length],
      qty,
      buy,
      current,
      invested,
      pl,
    };

    console.log(newHolding); // Replace with your own add logic

    setHoldings((prev) => [newHolding, ...prev]);
    setForm(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={cardStyle}
      className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
    >
      {/* Ticker */}
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Ticker Symbol
        </label>
        <input
          value={form.ticker}
          onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))}
          placeholder="AAPL"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "#1A2036",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
          }}
        />
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Company Name
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Apple Inc."
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "#1A2036",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
          }}
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Quantity
        </label>
        <input
          type="number"
          value={form.qty}
          onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
          placeholder="10"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "#1A2036",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
          }}
        />
      </div>

      {/* Buy Price */}
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Buy Price (₹)
        </label>
        <input
          type="number"
          value={form.buy}
          onChange={(e) => setForm((f) => ({ ...f, buy: e.target.value }))}
          placeholder="18000"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "#1A2036",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
          }}
        />
      </div>

      {/* Current Price */}
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Current Price (₹)
        </label>
        <input
          type="number"
          value={form.current}
          onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
          placeholder="21250"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "#1A2036",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="lg:col-span-3 flex justify-end gap-3">

        <button
          type="submit"
          className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{
            background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            color: "#fff",
          }}
        >
          Save Holding
        </button>
      </div>
    </form>
  );
}
