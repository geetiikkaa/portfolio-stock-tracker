import { cardStyle } from "../../constants/mockDataUnified";
import { formatINR } from "../../utils/utils";

export default function SummaryCard({ totals }) {
  return (
    <>
      <div
        className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4"
        style={cardStyle}
      >
        <div className="text-xs text-gray-500 mb-1">
          Total Bought / Deposited
        </div>
        <div className="text-xl font-semibold text-emerald-400">
          {formatINR(totals.bought)}
        </div>
      </div>
      <div
        className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4"
        style={cardStyle}
      >
        <div className="text-xs text-gray-500 mb-1">Total Sold / Withdrawn</div>
        <div className="text-xl font-semibold text-rose-400">
          {formatINR(totals.sold)}
        </div>
      </div>
      <div
        className="rounded-2xl border border-white/10 bg-[#12121d] px-6 py-4"
        style={cardStyle}
      >
        <div className="text-xs text-gray-500 mb-1">Net Flow</div>
        <div
          className={`text-xl font-semibold ${
            totals.net >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {totals.net >= 0 ? "+" : "-"}
          {formatINR(Math.abs(totals.net))}
        </div>
      </div>
    </>
  );
}
