export default function Tabs({tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex items-center gap-6 border-b border-white/10 sm:border-0 w-full sm:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative pb-3 sm:pb-0 text-sm whitespace-nowrap transition ${
            activeTab === tab
              ? "text-white font-medium"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute left-0 right-0 -bottom-px sm:-bottom-1 h-[2px] bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
