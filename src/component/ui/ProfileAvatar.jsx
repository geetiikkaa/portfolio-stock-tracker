export default function ProfileAvatar({ onClick }) {
  return (
    <button
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] text-white"
      onClick={onClick}
    >
      G
    </button>
  );
}
