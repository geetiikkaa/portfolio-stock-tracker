import { TYPE_STYLES } from "../../constants/ui";
import { CheckCircle2, Clock3, Trash2 } from "lucide-react";
import { formatINR } from "../../utils/utils";

export default function TransactionRow({ filtered, handleDelete }) {
  console.log(filtered);
  return (
    <>
      {filtered.map((transaction) => {
        let typeStyle = TYPE_STYLES[transaction.type];
        let TypeIcon = typeStyle.icon;
        return (
          <tr
            key={transaction.id}
            className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
          >
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: transaction.color }}
                >
                  {transaction.initial}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {transaction.ticker_snapshot} - {transaction.asset_id?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.asset_id?.asset_class}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-5 py-4">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${typeStyle.bg} ${typeStyle.color}`}
              >
                <TypeIcon size={12} />
                {transaction.type}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-300">
              {transaction.quantity
                ? `${transaction.quantity} ${transaction.unitLabel}`
                : "—"}
            </td>
            <td className="px-5 py-4 font-medium text-white">
              {formatINR(transaction.amount)}
            </td>
            <td className="px-5 py-4 text-gray-400">
              {new Date(transaction.occurred_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-4">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  transaction.status === "Completed"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {transaction.status === "Completed" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Clock3 size={13} />
                )}
                {transaction.status}
              </span>
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => handleDelete(transaction._id)}
                className="h-7 w-7 flex items-center justify-center rounded-md bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
              >
                <Trash2 size={13} />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
