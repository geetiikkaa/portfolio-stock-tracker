import { useRef, useState } from "react";
import { cardStyle } from "../../constants/ui";
import { formatUSD } from "../../utils/utils";
import axios from "axios";

const C = {
  text: "#F3F5FB",
  muted: "#8A91A8",
  cardBorder: "rgba(255,255,255,0.06)",
  blue: "#5B72F0",
  purple: "#8C7CF6",
};
const AVATAR_COLORS = [
  "#5B72F0",
  "#F0716B",
  "#2BCB8E",
  "#F5A623",
  "#8C7CF6",
  "#B49CF5",
];
const inputStyle = {
  background: "#1A2036",
  border: `1px solid ${C.cardBorder}`,
  color: C.text,
};
const emptyForm = {
  query: "",
  asset: null,
  type: "Buy",
  qty: "",
  price: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function AddHoldingForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);

  function handleQueryChange(value) {
    setForm((f) => ({ ...f, query: value, asset: null }));
    setShowResults(true);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/assets/search?q=${encodeURIComponent(
            value.trim(),
          )}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to search assets");
        }

        const data = await res.json();

        setResults(data.assets || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }

  async function selectAsset(asset) {
    console.log(asset);
    setShowResults(false);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/market/quote/${asset.asset_class === "Crypto" ? asset.external_id : asset.ticker}`,
        {
          withCredentials: true,
        },
      );
      console.log(res.data.data);

      setForm((f) => ({
        ...f,
        asset,
        query: asset.ticker,
        price: res.data.data.currentPrice ?? "",
      }));
    } catch (err) {
      console.error("Failed to fetch market quote:", err);

      setForm((f) => ({
        ...f,
        asset,
        query: asset.ticker,
        price: "",
      }));
    }
  }

  const qty = Number(form.qty) || 0;
  const price = Number(form.price) || 0;
  const estimatedValue = qty * price;

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.asset || !form.qty || !form.price || !form.date) return;

    onSubmit({
      asset: form.asset,
      ticker: form.asset.ticker,
      name: form.asset.name,
      qty,
      price,
      amount: qty * price,
      asset_class: form.asset.asset_class || "Equity",
      date: new Date(form.date).toISOString(),
      type: form.type,
    });
    setForm(emptyForm);
    onCancel?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={cardStyle}
      className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end mt-6"
    >
      <div className="relative">
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Search Asset
        </label>
        <input
          value={form.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => form.query && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search by ticker or name"
          autoComplete="off"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />
        {showResults && (searching || results.length > 0) && (
          <div
            className="absolute z-10 mt-1 w-full rounded-lg overflow-hidden max-h-48 overflow-y-auto"
            style={{
              background: "#1A2036",
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            {searching ? (
              <div className="px-3 py-2 text-xs" style={{ color: C.muted }}>
                Searching…
              </div>
            ) : (
              results.map((asset) => (
                <button
                  key={asset._id}
                  type="button"
                  onMouseDown={() => selectAsset(asset)}
                  className="w-full px-3 py-3 text-left hover:bg-white/5 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">
                        {asset.ticker}
                      </div>

                      <div className="text-xs text-gray-400">{asset.name}</div>
                    </div>

                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-400">
                      {asset.asset_class}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Transaction Type
        </label>
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
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
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Price per Share
        </label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          placeholder="18000"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Transaction Date
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: C.muted }}>
          Estimated Transaction Value
        </label>
        <div
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ ...inputStyle, color: C.muted }}
        >
          {formatUSD(estimatedValue)}
        </div>
      </div>
      <div className="lg:col-span-3 flex justify-end gap-3">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{
            background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            color: "#fff",
          }}
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
