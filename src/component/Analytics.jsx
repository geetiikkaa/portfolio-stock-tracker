import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import PortfolioSidebar from "./PortfolioSidebar";
import { RANGE_OPTIONS } from "../constants/mockDataUnified";
import { COLORS } from "../constants/ui";
import AnalyticsEmptyState from "./ui/AnalyticsEmptyState";
import Card from "./ui/Card";
import PortfolioGrowthCard from "./ui/PortfolioGrowthCard";
import ProfileAvatar from "./ui/ProfileAvatar";
import ProfileModal from "./ui/ProfileModal";
import AssetAllocationChart from "./ui/AssetAllocationChart";

export default function Analytics() {
  const [range, setRange] = useState("1Y");
  const [visibleSeries, setVisibleSeries] = useState({
    portfolio: true,
    nifty: true,
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [portfolio, setPortfolio] = useState(null);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setIsPortfolioLoading(true);

        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPortfolio(data.data);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    loadPortfolio();
  }, [BASE_URL]);

  const toggleSeries = useCallback((key) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return (
    <>
      <ProfileModal
        isModalOpen={isProfileModalOpen}
        onModalClose={() => setIsProfileModalOpen(false)}
      />

      <div
        className="flex min-h-screen w-full font-sans text-white"
        style={{
          background:
            "radial-gradient(120% 120% at 10% 0%, #0b1126 0%, #070b14 55%, #05070d 100%)",
        }}
      >
        <PortfolioSidebar />

        <div className="max-w-[1400px] w-full p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Analytics
            </h1>

            <div className="flex gap-4">
              <div
                className="flex items-center gap-1 rounded-xl border p-1"
                style={{
                  borderColor: COLORS.cardBorder,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {RANGE_OPTIONS.map((opt) => {
                  const active = opt === range;

                  return (
                    <button
                      key={opt}
                      onClick={() => setRange(opt)}
                      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "text-white shadow-lg shadow-indigo-500/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                      style={
                        active
                          ? {
                              background:
                                "linear-gradient(135deg, #6d5bf0, #8b5cf6)",
                            }
                          : undefined
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <ProfileAvatar onClick={() => setIsProfileModalOpen(true)} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <PortfolioGrowthCard
              range={range}
              visibleSeries={visibleSeries}
              toggleSeries={toggleSeries}
            />

            <AssetAllocationChart holdings={portfolio?.holdings || []} />

            {/* Monthly Returns */}
            <Card className="lg:col-span-2 min-h-[290px]">
              <h2 className="mb-4 text-[15px] font-semibold text-white">
                Monthly Returns
              </h2>

              <AnalyticsEmptyState />
            </Card>

            {/* Performance Metrics */}
            <Card className="min-h-[290px]">
              <h2 className="mb-1 text-[15px] font-semibold text-white">
                Performance Metrics
              </h2>

              <AnalyticsEmptyState
                title="Performance metrics unavailable"
                description="Best month, worst month, average returns, and positive months will appear once historical data is available."
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
