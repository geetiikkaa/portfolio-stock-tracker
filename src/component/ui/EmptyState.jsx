import { C } from "../../constants/ui";

export default function EmptyState({ text }) {
  return (
    <div className="text-sm text-center py-6" style={{ color: C.muted }}>
      {text}
    </div>
  );
}
