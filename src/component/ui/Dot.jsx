import { C } from "../../constants/mockData";

export default function Dot({ cx, cy, index, total }) {
  if (index !== total - 1) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={C.purple}
      stroke="#fff"
      strokeWidth={2}
    />
  );
}
