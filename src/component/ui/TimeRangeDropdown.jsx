import { useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { C } from "../../constants/mockData";
import { TIME_RANGES } from "../../constants/mockData";

export default function TimeRangeDropdown({ selectedRange, setSelectedRange }) {
  const rangeRef = useRef(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  return (
    <div className="relative" ref={rangeRef}>
      <button
        onClick={() => setIsRangeOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
        style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          color: C.text,
        }}
      >
        {selectedRange}
        <ChevronDown
          size={15}
          color={C.muted}
          style={{
            transform: isRangeOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {isRangeOpen && (
        <div
          className="absolute right-0 mt-2 py-1.5 rounded-xl z-20"
          style={{
            background: "#161B30",
            border: `1px solid ${C.cardBorder}`,
            minWidth: 160,
            boxShadow: "0 12px 30px -10px rgba(0,0,0,0.6)",
          }}
        >
          {TIME_RANGES.map((range) => {
            const active = range === selectedRange;
            return (
              <div
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setIsRangeOpen(false);
                }}
                className="flex items-center justify-between gap-3 px-4 py-2 text-sm cursor-pointer"
                style={{
                  color: active ? C.text : C.muted,
                  background: active ? "rgba(255,255,255,0.05)" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = active
                    ? "rgba(255,255,255,0.05)"
                    : "transparent")
                }
              >
                {range}
                {active && <Check size={14} color={C.purple} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
