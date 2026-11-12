export default function ViewAllButton({
  expand,
  toggleExpand,
}) {
  return (
    <button
      onClick={toggleExpand}
      className={`text-xs font-medium text-violet-500`}
    >
      {expand ? "Show Less" : "View All"}
    </button>
  );
}
