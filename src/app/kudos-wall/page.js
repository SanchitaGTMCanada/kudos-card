"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Heart,
  MessageCircleHeart,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

export default function KudosWallPage() {
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reactingId, setReactingId] = useState(null);

  useEffect(() => {
    async function loadKudos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/kudos/wall", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load Kudos Wall"
          );
        }

        setKudos(result.kudos || []);
      } catch (error) {
        console.error("Kudos Wall error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load Kudos Wall"
        );
      } finally {
        setLoading(false);
      }
    }

    loadKudos();
  }, []);

  function getInitials(name) {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(date) {
    const value = new Date(date);

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    const value = new Date(date);

    return value.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getCategoryStyle(categoryName) {
    switch (categoryName) {
      case "Great Work":
        return {
          background: "bg-[#FFF8E8]",
          iconBackground: "bg-[#FFF0C2]",
          text: "text-[#B77900]",
        };

      case "Team Player":
        return {
          background: "bg-[#EEF9F5]",
          iconBackground: "bg-[#D9F2E8]",
          text: "text-[#2C9A72]",
        };

      case "Innovation":
        return {
          background: "bg-[#EEF5FF]",
          iconBackground: "bg-[#DCEAFF]",
          text: "text-[#3C72C4]",
        };

      case "Going Extra Mile":
        return {
          background: "bg-[#FFF0F3]",
          iconBackground: "bg-[#FFE0E7]",
          text: "text-[#D94F6A]",
        };

      case "Problem Solver":
        return {
          background: "bg-[#F1EEFF]",
          iconBackground: "bg-[#E5DEFF]",
          text: "text-[#5B3CC4]",
        };

      default:
        return {
          background: "bg-[#F7F8FC]",
          iconBackground: "bg-[#EEF0F4]",
          text: "text-[#5B3CC4]",
        };
    }
  }

  async function handleReaction(kudosId, reaction) {
    if (reactingId === kudosId) {
      return;
    }

    setReactingId(kudosId);
    setError("");

    try {
      const response = await fetch(
        "/api/kudos/reactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kudosId,
            reaction,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update reaction"
        );
      }

      setKudos((currentKudos) =>
        currentKudos.map((item) => {
          if (item.id !== kudosId) {
            return item;
          }

          return {
            ...item,
            reactions: result.reactions,
            myReactions: result.myReactions,
          };
        })
      );
    } catch (error) {
      console.error("Reaction error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update reaction"
      );
    } finally {
      setReactingId(null);
    }
  }

  function hasReaction(item, reaction) {
    return item.myReactions?.includes(reaction);
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#70798A] transition hover:text-[#5B3CC4]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <Link
            href="/give-kudos"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B3CC4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4D32AD]"
          >
            <Sparkles size={16} />
            Give Kudos
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
            <MessageCircleHeart size={13} />
            Employee Recognition
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F]">
            Kudos Wall
          </h1>

          <p className="mt-2 max-w-[650px] text-[15px] leading-7 text-[#70798A]">
            Celebrate the people making a difference across
            the team.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#E8EAF0] bg-white p-6"
              >
                <div className="animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#EEF0F4]" />

                    <div className="flex-1">
                      <div className="h-4 w-40 rounded bg-[#EEF0F4]" />
                      <div className="mt-2 h-3 w-28 rounded bg-[#EEF0F4]" />
                    </div>
                  </div>

                  <div className="mt-6 h-20 rounded-xl bg-[#F3F4F7]" />

                  <div className="mt-5 h-10 rounded-xl bg-[#F3F4F7]" />
                </div>
              </div>
            ))}
          </div>
        ) : kudos.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-[#DDE1E8] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1EEFF]">
              <Sparkles
                size={28}
                className="text-[#5B3CC4]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#18212F]">
              No Kudos yet
            </h2>

            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#70798A]">
              Be the first person to recognize a teammate
              and start celebrating great work.
            </p>

            <Link
              href="/give-kudos"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4D32AD]"
            >
              <Sparkles size={16} />
              Give the First Kudos
            </Link>
          </div>
        ) : (
          /* Kudos Feed */
          <div className="space-y-5">
            {kudos.map((item) => {
              const categoryStyle = getCategoryStyle(
                item.category?.name
              );

              const isReacting =
                reactingId === item.id;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm"
                >
                  {/* Card Top */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Sender */}
                      <div className="flex min-w-0 items-center gap-4">
                        {item.sender?.profileImage ? (
                          <img
                            src={item.sender.profileImage}
                            alt={item.sender.name}
                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FF] text-sm font-bold text-[#5B3CC4]">
                            {getInitials(
                              item.sender?.name
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#18212F]">
                            {item.sender?.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#70798A]">
                            {item.sender?.designation ||
                              item.sender?.employeeId}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-[#9BA3B0]">
                          {formatDate(item.createdAt)}
                        </p>

                        <p className="mt-1 text-[11px] text-[#B0B6C0]">
                          {formatTime(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Recognition Line */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#70798A]">
                      <span>recognized</span>

                      <span className="font-bold text-[#18212F]">
                        {item.receiver?.name}
                      </span>

                      <span>for</span>

                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${categoryStyle.background} ${categoryStyle.text}`}
                      >
                        <span>
                          {item.category?.icon}
                        </span>

                        <span className="text-xs font-bold">
                          {item.category?.name}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-5 rounded-xl bg-[#F7F8FC] px-5 py-4">
                      <p className="text-[15px] leading-7 text-[#3D4654]">
                        “{item.message}”
                      </p>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-2 border-t border-[#F0F1F4] px-6 py-4">
                    {/* Heart */}
                    <button
                      type="button"
                      disabled={isReacting}
                      onClick={() =>
                        handleReaction(
                          item.id,
                          "heart"
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        hasReaction(item, "heart")
                          ? "border-[#F1B7C3] bg-[#FFF0F3] text-[#D94F6A]"
                          : "border-[#E8EAF0] bg-white text-[#70798A] hover:border-[#F1B7C3] hover:bg-[#FFF6F8] hover:text-[#D94F6A]"
                      }`}
                    >
                      <Heart
                        size={15}
                        fill={
                          hasReaction(item, "heart")
                            ? "currentColor"
                            : "none"
                        }
                      />

                      <span>
                        {item.reactions?.heart || 0}
                      </span>
                    </button>

                    {/* Clap */}
                    <button
                      type="button"
                      disabled={isReacting}
                      onClick={() =>
                        handleReaction(
                          item.id,
                          "clap"
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        hasReaction(item, "clap")
                          ? "border-[#CFC7F2] bg-[#F1EEFF] text-[#5B3CC4]"
                          : "border-[#E8EAF0] bg-white text-[#70798A] hover:border-[#CFC7F2] hover:bg-[#F8F6FF] hover:text-[#5B3CC4]"
                      }`}
                    >
                      <ThumbsUp
                        size={15}
                        fill={
                          hasReaction(item, "clap")
                            ? "currentColor"
                            : "none"
                        }
                      />

                      <span>
                        {item.reactions?.clap || 0}
                      </span>
                    </button>

                    {/* Fire */}
                    <button
                      type="button"
                      disabled={isReacting}
                      onClick={() =>
                        handleReaction(
                          item.id,
                          "fire"
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        hasReaction(item, "fire")
                          ? "border-[#FFD2A8] bg-[#FFF3E8] text-[#D97706]"
                          : "border-[#E8EAF0] bg-white text-[#70798A] hover:border-[#FFD2A8] hover:bg-[#FFF8F0] hover:text-[#D97706]"
                      }`}
                    >
                      <Flame
                        size={15}
                        fill={
                          hasReaction(item, "fire")
                            ? "currentColor"
                            : "none"
                        }
                      />

                      <span>
                        {item.reactions?.fire || 0}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}