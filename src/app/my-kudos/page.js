"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Gift,
  Heart,
  MessageCircleHeart,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

export default function MyKudosPage() {
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);

  const [activeTab, setActiveTab] = useState("received");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getCategoryStyle(categoryName) {
    switch (categoryName) {
      case "Great Work":
        return {
          background: "bg-[#FFF8E8]",
          text: "text-[#B77900]",
        };

      case "Team Player":
        return {
          background: "bg-[#EEF9F5]",
          text: "text-[#2C9A72]",
        };

      case "Innovation":
        return {
          background: "bg-[#EEF5FF]",
          text: "text-[#3C72C4]",
        };

      case "Going Extra Mile":
        return {
          background: "bg-[#FFF0F3]",
          text: "text-[#D94F6A]",
        };

      case "Problem Solver":
        return {
          background: "bg-[#F1EEFF]",
          text: "text-[#5B3CC4]",
        };

      default:
        return {
          background: "bg-[#F7F8FC]",
          text: "text-[#5B3CC4]",
        };
    }
  }

  useEffect(() => {
    async function loadMyKudos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/kudos/my", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load My Kudos"
          );
        }

        setReceived(result.received || []);
        setGiven(result.given || []);
      } catch (error) {
        console.error("My Kudos error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load My Kudos"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMyKudos();
  }, []);

  const activeKudos =
    activeTab === "received" ? received : given;

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5 lg:px-8">
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

      {/* Main */}
      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
            <MessageCircleHeart size={13} />
            Recognition History
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F]">
            My Kudos
          </h1>

          <p className="mt-2 max-w-[600px] text-[15px] leading-7 text-[#70798A]">
            See the appreciation you've received and the
            recognition you've shared with your teammates.
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

        {/* Tabs */}
        <div className="mb-7 rounded-2xl border border-[#E8EAF0] bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("received")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                activeTab === "received"
                  ? "bg-[#5B3CC4] text-white shadow-sm"
                  : "text-[#70798A] hover:bg-[#F7F8FC]"
              }`}
            >
              <Heart size={17} />

              Received

              {!loading && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeTab === "received"
                      ? "bg-white/20 text-white"
                      : "bg-[#F1F2F5] text-[#70798A]"
                  }`}
                >
                  {received.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("given")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                activeTab === "given"
                  ? "bg-[#5B3CC4] text-white shadow-sm"
                  : "text-[#70798A] hover:bg-[#F7F8FC]"
              }`}
            >
              <Gift size={17} />

              Given

              {!loading && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeTab === "given"
                      ? "bg-white/20 text-white"
                      : "bg-[#F1F2F5] text-[#70798A]"
                  }`}
                >
                  {given.length}
                </span>
              )}
            </button>
          </div>
        </div>

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
                </div>
              </div>
            ))}
          </div>
        ) : activeKudos.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-dashed border-[#DDE1E8] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1EEFF]">
              {activeTab === "received" ? (
                <Heart
                  size={28}
                  className="text-[#5B3CC4]"
                />
              ) : (
                <Gift
                  size={28}
                  className="text-[#5B3CC4]"
                />
              )}
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#18212F]">
              {activeTab === "received"
                ? "No Kudos received yet"
                : "No Kudos given yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#70798A]">
              {activeTab === "received"
                ? "When someone recognizes your work, their Kudos will appear here."
                : "Recognize a teammate and your Kudos will appear here."}
            </p>

            {activeTab === "given" && (
              <Link
                href="/give-kudos"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4D32AD]"
              >
                <Sparkles size={16} />
                Give Kudos
              </Link>
            )}
          </div>
        ) : (
          /* Kudos List */
          <div className="space-y-5">
            {activeKudos.map((item) => {
              const categoryStyle = getCategoryStyle(
                item.category?.name
              );

              const person =
                activeTab === "received"
                  ? item.sender
                  : item.receiver;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm"
                >
                  <div className="p-6">
                    {/* Person */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        {person?.profileImage ? (
                          <img
                            src={person.profileImage}
                            alt={person.name}
                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FF] text-sm font-bold text-[#5B3CC4]">
                            {getInitials(person?.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#18212F]">
                            {person?.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#70798A]">
                            {person?.designation ||
                              person?.employeeId}
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

                    {/* Context */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#70798A]">
                      {activeTab === "received" ? (
                        <>
                          <span>recognized you for</span>
                        </>
                      ) : (
                        <>
                          <span>you recognized</span>

                          <span className="font-bold text-[#18212F]">
                            {item.receiver?.name}
                          </span>

                          <span>for</span>
                        </>
                      )}

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
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs font-semibold text-[#70798A]">
                      <Heart
                        size={15}
                        className="text-[#D94F6A]"
                        fill={
                          item.myReactions?.includes(
                            "heart"
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {item.reactions?.heart || 0}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs font-semibold text-[#70798A]">
                      <ThumbsUp
                        size={15}
                        className="text-[#5B3CC4]"
                        fill={
                          item.myReactions?.includes(
                            "clap"
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {item.reactions?.clap || 0}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs font-semibold text-[#70798A]">
                      <Flame
                        size={15}
                        className="text-[#D97706]"
                        fill={
                          item.myReactions?.includes(
                            "fire"
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {item.reactions?.fire || 0}
                    </div>
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