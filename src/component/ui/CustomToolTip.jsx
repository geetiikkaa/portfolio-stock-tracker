import { C } from "../../constants/mockData";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div
      style={{
        background: "#1A2036",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: "10px",
        padding: "8px 12px",
      }}
    >
      <div className="text-xs" style={{ color: C.muted }}>
        {label}
      </div>
      <div className="text-sm font-semibold" style={{ color: C.text }}>
        ₹{value.toFixed(2)}L
      </div>
    </div>
  );
}
