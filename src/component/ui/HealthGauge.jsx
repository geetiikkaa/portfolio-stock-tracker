import { C } from "../../constants/mockData";
import { Star } from "lucide-react";

export default function HealthGauge({ score = 85 }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: 88, height: 88 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="7"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={C.green}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Star size={20} fill={C.green} color={C.green} strokeWidth={1} />
      </div>
    </div>
  );
}
