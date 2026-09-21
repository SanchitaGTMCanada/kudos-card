"use client";

import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Heart,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function RecentKudos() {
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentKudos() {
      try {
        const response = await fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load recent Kudos"
          );
        }

        setKudos(result.recentKudos || []);
      } catch (error) {
        console.error("Recent Kudos error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentKudos();
  }, []);

  function getCategoryIcon(categoryName) {
    const name = categoryName?.toLowerCase() || "";

    if (
      name.includes("extra") ||
      name.includes("mile") ||
      name.includes("effort")
    ) {
      return Flame;
    }

    return Sparkles;
  }

  function getCategoryStyle(categoryName) {
    const name = categoryName?.toLowerCase() || "";

    if (
      name.includes("extra") ||
      name.includes("mile") ||
      name.includes("effort")
    ) {
      return {
        iconBg: "bg-[#FFF0EB]",
        iconColor: "text-[#E56A3D]",
      };
    }

    return {
      iconBg: "bg-[#FFF7E5]",
      iconColor: "text-[#C9911A]",
    };
  }

  function formatTime(dateString) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <section className="mt-10">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A92A2]">
            Recognition
          </p>

          <h2 className="mt-1 text-[23px] font-bold tracking-[-0.03em] text-[#18212F]">
            Recent Kudos
          </h2>
        </div>

        <Link
          href="/kudos-wall"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3CC4] transition hover:text-[#4D32AD]"
        >
          View all

          <ArrowRight size={15} />
        </Link>

      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">

          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-[#E8EAF0] bg-white p-6"
            >
              <div className="flex gap-5">

                <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-[#EEF0F4]" />

                <div className="flex-1">

                  <div className="h-3 w-28 animate-pulse rounded bg-[#EEF0F4]" />

                  <div className="mt-4 h-4 w-48 animate-pulse rounded bg-[#EEF0F4]" />

                  <div className="mt-3 h-4 w-full max-w-[600px] animate-pulse rounded bg-[#EEF0F4]" />

                  <div className="mt-5 h-7 w-24 animate-pulse rounded-full bg-[#EEF0F4]" />

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* Empty State */}
      {!loading && kudos.length === 0 && (
        <div className="rounded-[22px] border border-[#E8EAF0] bg-white px-6 py-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EEFF]">
            <Sparkles
              size={24}
              className="text-[#5B3CC4]"
            />
          </div>

          <h3 className="mt-4 text-base font-bold text-[#18212F]">
            No Kudos yet
          </h3>

          <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#7A8392]">
            Be the first to recognize someone who made
            a difference.
          </p>

          <Link
            href="/give-kudos"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4D32AD]"
          >
            <Sparkles size={16} />
            Give Kudos
          </Link>

        </div>
      )}

      {/* Kudos List */}
      {!loading && kudos.length > 0 && (
        <div className="space-y-4">

          {kudos.map((item) => {
            const Icon = getCategoryIcon(
              item.category?.name
            );

            const categoryStyle = getCategoryStyle(
              item.category?.name
            );

            return (
              <article
                key={item.id}
                className="rounded-[22px] border border-[#E8EAF0] bg-white p-6 transition hover:border-[#DCD6F5] hover:shadow-[0_12px_35px_rgba(31,35,55,0.06)]"
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                  {/* Category Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${categoryStyle.iconBg}`}
                  >
                    <Icon
                      size={21}
                      className={categoryStyle.iconColor}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7A8392]">
                        {item.category?.name ||
                          "Recognition"}
                      </span>

                      <span className="text-[11px] text-[#A0A7B4]">
                        {formatTime(item.createdAt)}
                      </span>

                    </div>

                    {/* Sender → Receiver */}
                    <p className="mt-3 text-sm font-semibold text-[#303A48]">

                      {item.sender?.name ||
                        "Unknown"}

                      <span className="mx-2 font-normal text-[#B1B7C1]">
                        →
                      </span>

                      {item.receiver?.name ||
                        "Unknown"}

                    </p>

                    {/* Message */}
                    <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#687383]">
                      "{item.message}"
                    </p>

                    {/* Reactions */}
                    <div className="mt-5 flex items-center gap-3">

                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full bg-[#FFF3F5] px-3 py-1.5 text-xs font-semibold text-[#D95169]"
                      >
                        <Heart size={13} />

                        {item.reactions?.heart || 0}
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full bg-[#EEF4FF] px-3 py-1.5 text-xs font-semibold text-[#3C6FC5]"
                      >
                        <ThumbsUp size={13} />

                        {item.reactions?.clap || 0}
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full bg-[#FFF4EA] px-3 py-1.5 text-xs font-semibold text-[#D76C2C]"
                      >
                        <Flame size={13} />

                        {item.reactions?.fire || 0}
                      </button>

                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}