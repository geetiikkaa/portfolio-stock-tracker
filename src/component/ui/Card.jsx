import { COLORS } from "../../constants/mockData";

export default function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border bg-[${COLORS.card}] p-5 ${className}`}
      style={{ background: COLORS.card, borderColor: COLORS.cardBorder }}
    >
      {children}
    </div>
  );
}
