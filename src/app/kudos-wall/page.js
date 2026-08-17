"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

const filters = [
  "All",
  "Great Work",
  "Team Player",
  "Innovation",
  "Going Extra Mile",
  "Problem Solver",
];

const kudosData = [
  {
    id: 1,
    category: "Great Work",
    icon: "⭐",
    sender: "Rahul Sharma",
    receiver: "Priya Das",
    senderInitials: "RS",
    receiverInitials: "PD",
    message:
      "Amazing work on the client presentation. You really helped the team deliver it successfully!",
    time: "2 hours ago",
    reactions: {
      heart: 12,
      clap: 8,
      fire: 5,
    },
  },
  {
    id: 2,
    category: "Going Extra Mile",
    icon: "🚀",
    sender: "Neha Sen",
    receiver: "Amit Roy",
    senderInitials: "NS",
    receiverInitials: "AR",
    message:
      "Thank you for going above and beyond to help us resolve the issue before the deadline.",
    time: "5 hours ago",
    reactions: {
      heart: 9,
      clap: 6,
      fire: 11,
    },
  },
  {
    id: 3,
    category: "Team Player",
    icon: "🤝",
    sender: "Priya Das",
    receiver: "Rahul Sharma",
    senderInitials: "PD",
    receiverInitials: "RS",
    message:
      "Thank you for always being available when the team needs help. Your support makes a real difference.",
    time: "Yesterday",
    reactions: {
      heart: 17,
      clap: 12,
      fire: 4,
    },
  },
  {
    id: 4,
    category: "Innovation",
    icon: "💡",
    sender: "Amit Roy",
    receiver: "Neha Sen",
    senderInitials: "AR",
    receiverInitials: "NS",
    message:
      "That new process you suggested has made our daily workflow so much easier. Great thinking!",
    time: "Yesterday",
    reactions: {
      heart: 14,
      clap: 9,
      fire: 7,
    },
  },
];

export default function KudosWallPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState([]);

  const filteredKudos = kudosData.filter((kudos) => {
    const matchesFilter =
      activeFilter === "All" || kudos.category === activeFilter;

    const searchText = `${kudos.sender} ${kudos.receiver} ${kudos.message}`
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">

      {/* Header */}

      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-6 lg:px-8">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-[#596273] hover:text-[#18212F]"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B3CC4] text-white">
              <Sparkles size={17} />
            </div>

            <span className="text-[16px] font-bold text-[#18212F]">
              Kudos Card
            </span>
          </div>

          <Link
            href="/give-kudos"
            className="rounded-xl bg-[#5B3CC4] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4D32AD]"
          >
            + Give Kudos
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 py-10 lg:px-8">

        {/* Hero */}

        <section className="mb-8 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5B3CC4]">
            <Sparkles size={13} />
            Company Recognition
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F] sm:text-[44px]">
            Kudos Wall ✨
          </h1>

          <p className="mx-auto mt-3 max-w-[580px] text-[15px] leading-7 text-[#70798A]">
            Celebrate the people who make our workplace better,
            one appreciation at a time.
          </p>

        </section>

        {/* Search */}

        <div className="mb-6 flex justify-center">

          <div className="relative w-full max-w-[520px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people or appreciation..."
              className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none placeholder:text-[#A4ABB6] focus:border-[#B9A9EA] focus:ring-4 focus:ring-[#F1EEFF]"
            />

          </div>

        </div>

        {/* Filters */}

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeFilter === filter
                  ? "bg-[#5B3CC4] text-white"
                  : "border border-[#E2E5EB] bg-white text-[#687383] hover:border-[#D5CFF0] hover:text-[#5B3CC4]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Kudos */}

        <div className="space-y-5">

          {filteredKudos.map((kudos) => {
            const isLiked = liked.includes(kudos.id);

            return (
              <article
                key={kudos.id}
                className="rounded-[26px] border border-[#E8EAF0] bg-white p-6 shadow-[0_5px_20px_rgba(31,35,55,0.025)] transition hover:border-[#DDD6F4] hover:shadow-[0_15px_40px_rgba(31,35,55,0.06)] sm:p-8"
              >

                {/* Top */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                      {kudos.senderInitials}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#18212F]">
                        {kudos.sender}
                      </p>

                      <p className="mt-0.5 text-xs text-[#9BA3B0]">
                        recognized a colleague
                      </p>
                    </div>

                  </div>

                  <span className="text-xs text-[#A0A7B4]">
                    {kudos.time}
                  </span>

                </div>

                {/* Card */}

                <div className="mt-6 rounded-[22px] bg-gradient-to-br from-[#F6F2FF] via-[#FCFBFF] to-[#FFF8E9] p-7">

                  <div className="text-center">

                    <div className="text-4xl">
                      {kudos.icon}
                    </div>

                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7257C7]">
                      {kudos.category}
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#5B3CC4] shadow-sm">
                        {kudos.senderInitials}
                      </div>

                      <span className="text-[#A3A9B3]">→</span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#5B3CC4] shadow-sm">
                        {kudos.receiverInitials}
                      </div>

                    </div>

                    <h2 className="mt-4 text-xl font-bold text-[#18212F]">
                      {kudos.receiver}
                    </h2>

                    <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-[#687383]">
                      "{kudos.message}"
                    </p>

                    <p className="mt-5 text-xs font-semibold text-[#8A92A2]">
                      From {kudos.sender}
                    </p>

                  </div>

                </div>

                {/* Reactions */}

                <div className="mt-5 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => toggleLike(kudos.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                        isLiked
                          ? "bg-[#FFF0F3] text-[#D95169]"
                          : "bg-[#F7F8FC] text-[#687383] hover:bg-[#FFF0F3] hover:text-[#D95169]"
                      }`}
                    >
                      <Heart
                        size={14}
                        fill={isLiked ? "currentColor" : "none"}
                      />

                      {kudos.reactions.heart + (isLiked ? 1 : 0)}
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full bg-[#F7F8FC] px-3.5 py-2 text-xs font-semibold text-[#687383] hover:bg-[#EEF4FF] hover:text-[#3C6FC5]">
                      <ThumbsUp size={14} />
                      {kudos.reactions.clap}
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full bg-[#F7F8FC] px-3.5 py-2 text-xs font-semibold text-[#687383] hover:bg-[#FFF4EA] hover:text-[#D76C2C]">
                      <Flame size={14} />
                      {kudos.reactions.fire}
                    </button>

                  </div>

                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#8A92A2] hover:text-[#5B3CC4]">
                    <MessageCircle size={14} />
                    Appreciate
                  </button>

                </div>

              </article>
            );
          })}

        </div>

        {filteredKudos.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#D9DCE4] bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEFF] text-[#5B3CC4]">
              <Search size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#18212F]">
              No Kudos found
            </h3>

            <p className="mt-2 text-sm text-[#8A92A2]">
              Try another search or recognition category.
            </p>

          </div>
        )}

      </main>

    </div>
  );
}