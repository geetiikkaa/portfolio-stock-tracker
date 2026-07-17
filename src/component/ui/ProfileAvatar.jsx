import { useSelector } from "react-redux";

export default function ProfileAvatar({ onClick }) {
  let user = useSelector((state) => state.auth.user);

  return (
    <button
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] text-white"
      onClick={onClick}
    >
      {user.name.charAt(0)}
    </button>
  );
}
