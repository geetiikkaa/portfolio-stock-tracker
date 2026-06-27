import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Download,
  Trash2,
  X,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import { INITIAL_TRANSACTIONS } from "../constants/mockData";
import { emptyForm } from "../constants/mockData";
import { ASSET_TABS } from "../constants/mockData";
import { TYPE_FILTERS } from "../constants/mockData";
import { inr } from "../constants/mockData";
import { TYPE_STYLES } from "../constants/mockData";

export default function Transactions() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesTab = activeTab === "All" || t.assetClass === activeTab;
      const matchesType = typeFilter === "All" || t.type === typeFilter;
      const matchesSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.ticker.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesType && matchesSearch;
    });
  }, [transactions, activeTab, typeFilter, search]);

  const totals = useMemo(() => {
    const bought = transactions
      .filter((t) => t.type === "Buy" || t.type === "Deposit")
      .reduce((sum, t) => sum + t.amount, 0);
    const sold = transactions
      .filter((t) => t.type === "Sell" || t.type === "Withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);
    return { bought, sold, net: bought - sold };
  }, [transactions]);

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;

    const newTxn = {
      id: Date.now(),
      ticker:
        form.ticker.trim().toUpperCase() || form.name.slice(0, 4).toUpperCase(),
      name: form.name.trim(),
      initial: form.name.trim().slice(0, 2).toUpperCase(),
      color: "#4b3a8c",
      assetClass: form.assetClass,
      type: form.type,
      qty: form.qty ? Number(form.qty) : null,
      unitLabel:
        form.assetClass === "Mutual Funds"
          ? "Units"
          : form.assetClass === "Crypto"
            ? form.ticker.toUpperCase()
            : "Shares",
      amount: Number(form.amount),
      date: "Just now",
      status: "Completed",
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] flex text-white">
      <PortfolioSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#12121d] px-3.5 py-2 text-sm text-gray-300 hover:bg-white/5 transition">
              <Download size={15} />
              Export
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add Transaction"}
            </button>
          </div>
        </div>

        {/* Add transaction form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-white/10 bg-[#12121d] p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end"
          >
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Stock / Asset Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Wipro Ltd."
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ticker</label>
              <input
                value={form.ticker}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ticker: e.target.value }))
                }
                placeholder="WIPRO"
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Asset Class
              </label>
              <select
                value={form.assetClass}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assetClass: e.target.value }))
                }
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#7c5cff]/60"
              >
                {ASSET_TABS.filter((t) => t !== "All").map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#7c5cff]/60"
              >
                {TYPE_FILTERS.filter((t) => t !== "All").map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Quantity
              </label>
              <input
                type="number"
                step="any"
                value={form.qty}
                onChange={(e) =>
                  setForm((f) => ({ ...f, qty: e.target.value }))
                }
                placeholder="Optional"
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="10000"
                required
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
              />
            </div>
            <div className="col-span-2 sm:col-span-3 lg:col-span-6 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] px-5 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Save Transaction
              </button>
            </div>
          </form>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4">
            <div className="text-xs text-gray-500 mb-1">
              Total Bought / Deposited
            </div>
            <div className="text-xl font-semibold text-emerald-400">
              {inr(totals.bought)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4">
            <div className="text-xs text-gray-500 mb-1">
              Total Sold / Withdrawn
            </div>
            <div className="text-xl font-semibold text-rose-400">
              {inr(totals.sold)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4">
            <div className="text-xs text-gray-500 mb-1">Net Flow</div>
            <div
              className={`text-xl font-semibold ${
                totals.net >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {totals.net >= 0 ? "+" : "-"}
              {inr(Math.abs(totals.net))}
            </div>
          </div>
        </div>

        {/* Tabs + filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-6 border-b border-white/10 sm:border-0 w-full sm:w-auto">
            {ASSET_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 sm:pb-0 text-sm whitespace-nowrap transition ${
                  activeTab === tab
                    ? "text-white font-medium"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px sm:-bottom-1 h-[2px] bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-52 rounded-lg bg-[#1a1a28] border border-white/10 pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#7c5cff]/60"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-[#12121d] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide border-b border-white/10">
                <th className="px-5 py-3 font-medium">Stock / Asset</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const typeStyle = TYPE_STYLES[t.type];
                  const TypeIcon = typeStyle.icon;
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: t.color }}
                          >
                            {t.initial}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {t.ticker} - {t.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t.assetClass}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${typeStyle.bg} ${typeStyle.color}`}
                        >
                          <TypeIcon size={12} />
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">
                        {t.qty ? `${t.qty} ${t.unitLabel}` : "—"}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {inr(t.amount)}
                      </td>
                      <td className="px-5 py-4 text-gray-400">{t.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            t.status === "Completed"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {t.status === "Completed" ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Clock3 size={13} />
                          )}
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="mt-4 text-xs text-gray-500">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </main>
    </div>
  );
}
