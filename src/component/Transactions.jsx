import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import {
  TYPE_FILTERS,
  ASSET_TABS,
  emptyForm,
  cardStyle,
  INITIAL_TRANSACTIONS,
} from "../constants/mockDataUnified";
import Tabs from "./ui/Tabs";
import ProfileAvatar from "./ui/ProfileAvatar";
import Dropdown from "./ui/Dropdown";
import ProfileModal from "./ui/ProfileModal";
import SummaryCard from "./ui/SummaryCard";
import TransactionRow from "./ui/TransactionRow";

function filterTransactions(transactions, activeTab, typeFilter, search) {
  let q = search.trim().toLowerCase();

  return transactions.filter(
    (transaction) =>
      (activeTab === "All" || transaction.assetClass === activeTab) &&
      (typeFilter === "All" || transaction.type === typeFilter) &&
      (q === "" ||
        transaction.name.toLowerCase().includes(q) ||
        transaction.ticker.toLowerCase().includes(q)),
  );
}

export default function Transactions() {
  let [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  let [activeTab, setActiveTab] = useState("All");
  let [typeFilter, setTypeFilter] = useState("All");
  let [search, setSearch] = useState("");
  let [showForm, setShowForm] = useState(false);
  let [form, setForm] = useState(emptyForm);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  let filtered = useMemo(
    () => filterTransactions(transactions, activeTab, typeFilter, search),
    [transactions, activeTab, typeFilter, search],
  );

  let totals = useMemo(() => {
    let bought = 0;
    let sold = 0;

    for (let transaction of transactions) {
      if (transaction.type === "Buy" || transaction.type === "Deposit")
        bought += transaction.amount;
      else if (transaction.type === "Sell" || transaction.type === "Withdrawal")
        sold += transaction.amount;
    }

    return {
      bought,
      sold,
      net: bought - sold,
    };
  }, [transactions]);
  let handleDelete = (id) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id),
    );
  };
  let handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;
    let newTxn = {
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
  let handleChange = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
      <div className="min-h-screen w-full bg-[#0a0a12] flex text-white">
        <PortfolioSidebar />

        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <div className="flex gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowForm((v) => !v)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition"
                >
                  {showForm ? <X size={16} /> : <Plus size={16} />}
                  {showForm ? "Cancel" : "Add Transaction"}
                </button>
                <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
              </div>
            </div>
          </div>

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
                  onChange={handleChange("name")}
                  placeholder="e.g. Wipro Ltd."
                  className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Ticker
                </label>
                <input
                  value={form.ticker}
                  onChange={handleChange("ticker")}
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
                  onChange={handleChange("assetClass")}
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
                  onChange={handleChange("type")}
                  className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#7c5cff]/60"
                >
                  {TYPE_FILTERS.filter(
                    (transaction) => transaction !== "All",
                  ).map((transaction) => (
                    <option key={transaction} value={transaction}>
                      {transaction}
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
                  onChange={handleChange("qty")}
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
                  onChange={handleChange("amount")}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard totals={totals} />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <Tabs
              tabs={ASSET_TABS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

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
              <Dropdown
                list={TYPE_FILTERS}
                selectedRange={typeFilter}
                setSelectedRange={setTypeFilter}
              />
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={cardStyle}
          >
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
                  <TransactionRow
                    filtered={filtered}
                    handleDelete={handleDelete}
                  />
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Showing {filtered.length} of {transactions.length} transactions
          </div>
        </main>
      </div>
    </>
  );
}
