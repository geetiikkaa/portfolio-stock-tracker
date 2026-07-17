export default function ViewAllButton({
  expand,
  toggleExpand,
  textAlignUtility = "",
}) {
  return (
    <button
      onClick={toggleExpand}
      className={`text-xs font-medium text-violet-500 ${textAlignUtility}`}
    >
      {expand ? "Show Less" : "View All"}
    </button>
  );
}
