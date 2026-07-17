export default function SeriesToggle({
  toggleSeries,
  color,
  isVisible,
  name,
  label,
}) {
  return (
    <button
      onClick={() => toggleSeries(name)}
      className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
      style={{ opacity: isVisible ? 1 : 0.4 }}
    >
      <span
        className="h-[3px] w-4 rounded-full"
        style={{ background: color }}
      />
      <span className="text-slate-300">{label}</span>
    </button>
  );
}
