"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalGiven: 0,
    totalReceived: 0,
    thisMonth: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load dashboard"
          );
        }

        setStats(result.stats);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Kudos Given",
      value: stats.totalGiven,
      description: "Total appreciation sent",
      icon: Gift,
      iconBg: "bg-[#F1EEFF]",
      iconColor: "text-[#5B3CC4]",
    },
    {
      title: "Kudos Received",
      value: stats.totalReceived,
      description: "Total appreciation received",
      icon: Heart,
      iconBg: "bg-[#FFF0F3]",
      iconColor: "text-[#E85D75]",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      description: "Kudos this month",
      icon: TrendingUp,
      iconBg: "bg-[#EEF9F5]",
      iconColor: "text-[#2C9A72]",
    },
  ];

  return (
    <section className="mt-8">

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-[#E8EAF0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-[#70798A]">
                    {card.title}
                  </p>

                  <div className="mt-2">

                    {loading ? (
                      <div className="h-9 w-16 animate-pulse rounded-lg bg-[#EEF0F4]" />
                    ) : (
                      <p className="text-[30px] font-bold tracking-[-0.04em] text-[#18212F]">
                        {card.value}
                      </p>
                    )}

                  </div>

                  <p className="mt-1 text-xs text-[#9BA3B0]">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon
                    size={20}
                    className={card.iconColor}
                  />
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}