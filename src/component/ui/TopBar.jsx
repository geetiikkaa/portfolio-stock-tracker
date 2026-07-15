import { Search } from "lucide-react";
import { C } from "../../constants/mockDataUnified";
import { X } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function TopBar({ searchQuery, setSearchQuery }) {
  let [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-full flex-1 max-w-sm"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
      >
        <Search size={16} color={C.mutedSoft} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stocks, news, insights..."
          className="dashboard-search text-sm bg-transparent outline-none flex-1 min-w-0"
          style={{ color: C.text }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="flex items-center justify-center shrink-0"
            aria-label="Clear search"
          >
            <X size={14} color={C.mutedSoft} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
      </div>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
