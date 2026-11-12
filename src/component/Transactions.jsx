import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import PortfolioSidebar from "./PortfolioSidebar";
import { ASSET_TABS, TYPE_FILTERS, cardStyle } from "../constants/ui";
import Tabs from "./ui/Tabs";
import ProfileAvatar from "./ui/ProfileAvatar";
import Dropdown from "./ui/Dropdown";
import ProfileModal from "./ui/ProfileModal";
import SummaryCard from "./ui/SummaryCard";
import TransactionRow from "./ui/TransactionRow";
import axios from "axios";
import AddHoldingForm from "./ui/AddHoldingForm";

function filterTransactions(transactions, activeTab, typeFilter, search) {
  const q = search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const assetClass =
      transaction.asset_id?.asset_class ??
      (transaction.ticker_snapshot === "CASH" ? "Cash" : "");
    const assetName =
      transaction.asset_id?.name || transaction.name_snapshot || "";

    return (
      (activeTab === "All" || assetClass === activeTab) &&
      (typeFilter === "All" || transaction.type === typeFilter) &&
      (q === "" ||
        assetName.toLowerCase().includes(q) ||
        transaction.ticker_snapshot.toLowerCase().includes(q))
    );
  });
}

export default function Transactions() {
  let [transactions, setTransactions] = useState([]);
  let [activeTab, setActiveTab] = useState("All");
  let [typeFilter, setTypeFilter] = useState("All");
  let [search, setSearch] = useState("");
  let [showForm, setShowForm] = useState(false);
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  let [isLoading, setIsLoading] = useState(true);

  let getTransactions = async () => {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

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
  let handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      await getTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTransaction = async (tx) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/transactions`,
        {
          asset_id: tx.asset._id,
          type: tx.type,
          quantity: tx.qty,
          price_per_unit: tx.price,
          amount: tx.qty * tx.price,
          occurred_at: tx.date,
          status: "Completed",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      await getTransactions();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
      <div className="min-h-screen w-full bg-[#0a0a12] flex text-white">
        <PortfolioSidebar />

        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
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
            <AddHoldingForm
              onSubmit={handleCreateTransaction}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
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
