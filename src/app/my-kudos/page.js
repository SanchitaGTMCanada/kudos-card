"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Heart,
  Search,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

const kudos = [
  {
    id: 1,
    type: "received",
    category: "Great Work",
    icon: "⭐",
    sender: "Rahul Sharma",
    receiver: "Sanchita Sharma",
    initials: "RS",
    message:
      "Amazing work on the client presentation. Your attention to detail really helped us deliver it successfully.",
    date: "Today, 10:32 AM",
    reactions: {
      heart: 12,
      clap: 8,
      fire: 4,
    },
  },
  {
    id: 2,
    type: "received",
    category: "Team Player",
    icon: "🤝",
    sender: "Priya Das",
    receiver: "Sanchita Sharma",
    initials: "PD",
    message:
      "Thank you for always helping the team whenever we need support. You make collaboration much easier.",
    date: "Yesterday, 4:15 PM",
    reactions: {
      heart: 17,
      clap: 10,
      fire: 3,
    },
  },
  {
    id: 3,
    type: "received",
    category: "Going Extra Mile",
    icon: "🚀",
    sender: "Neha Sen",
    receiver: "Sanchita Sharma",
    initials: "NS",
    message:
      "You went above and beyond to get this work completed before the deadline. Really appreciate your effort!",
    date: "12 Aug 2026",
    reactions: {
      heart: 14,
      clap: 7,
      fire: 9,
    },
  },
  {
    id: 4,
    type: "given",
    category: "Innovation",
    icon: "💡",
    sender: "Sanchita Sharma",
    receiver: "Amit Roy",
    initials: "AR",
    message:
      "Your new idea made the workflow much simpler for everyone. Great thinking and execution!",
    date: "11 Aug 2026",
    reactions: {
      heart: 9,
      clap: 5,
      fire: 6,
    },
  },
  {
    id: 5,
    type: "given",
    category: "Problem Solver",
    icon: "🧩",
    sender: "Sanchita Sharma",
    receiver: "Rahul Sharma",
    initials: "RS",
    message:
      "Thank you for jumping in and solving the deployment issue when the team needed you.",
    date: "9 Aug 2026",
    reactions: {
      heart: 11,
      clap: 6,
      fire: 5,
    },
  },
  {
    id: 6,
    type: "given",
    category: "Team Player",
    icon: "🤝",
    sender: "Sanchita Sharma",
    receiver: "Priya Das",
    initials: "PD",
    message:
      "Your support during the release made a huge difference. Thank you for being such a great teammate.",
    date: "7 Aug 2026",
    reactions: {
      heart: 8,
      clap: 4,
      fire: 3,
    },
  },
];

const categories = [
  "All",
  "Great Work",
  "Team Player",
  "Innovation",
  "Going Extra Mile",
  "Problem Solver",
];

export default function MyKudosPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const receivedCount = kudos.filter(
    (item) => item.type === "received"
  ).length;

  const givenCount = kudos.filter(
    (item) => item.type === "given"
  ).length;

  const thisMonthCount = 12;

  const filteredKudos = useMemo(() => {
    return kudos.filter((item) => {
      const matchesTab = item.type === activeTab;

      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const searchValue = `
        ${item.sender}
        ${item.receiver}
        ${item.category}
        ${item.message}
      `.toLowerCase();

      const matchesSearch = searchValue.includes(
        search.toLowerCase()
      );

      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [activeTab, activeCategory, search]);

  function toggleLike(id) {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleExpanded(id) {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">

      {/* Header */}

      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-6 lg:px-8">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-[#596273] transition hover:text-[#18212F]"
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
            className="rounded-xl bg-[#5B3CC4] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4D32AD]"
          >
            + Give Kudos
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6 py-10 lg:px-8">

        {/* Page heading */}

        <section className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5B3CC4]">
            <Sparkles size={13} />
            My Recognition
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F] sm:text-[44px]">
            My Kudos
          </h1>

          <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-[#70798A]">
            See the appreciation you've received and the people
            you've recognized.
          </p>

        </section>

        {/* Stats */}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">

          <StatCard
            icon={<Heart size={19} />}
            iconClass="bg-[#FFF0F3] text-[#D95169]"
            value={receivedCount}
            label="Kudos Received"
            detail="Recognition from colleagues"
          />

          <StatCard
            icon={<Sparkles size={19} />}
            iconClass="bg-[#F1EEFF] text-[#5B3CC4]"
            value={givenCount}
            label="Kudos Given"
            detail="People you've appreciated"
          />

          <StatCard
            icon={<Flame size={19} />}
            iconClass="bg-[#FFF4EA] text-[#D76C2C]"
            value={thisMonthCount}
            label="This Month"
            detail="Recognition activity"
          />

        </section>

        {/* Main content */}

        <section className="rounded-[26px] border border-[#E8EAF0] bg-white">

          {/* Tabs */}

          <div className="border-b border-[#E8EAF0] px-6 pt-5 sm:px-8">

            <div className="flex gap-7">

              <button
                onClick={() => setActiveTab("received")}
                className={`relative pb-4 text-sm font-bold transition ${
                  activeTab === "received"
                    ? "text-[#5B3CC4]"
                    : "text-[#8A92A2] hover:text-[#596273]"
                }`}
              >
                Received
                <span className="ml-2 rounded-full bg-[#F1EEFF] px-2 py-0.5 text-[10px]">
                  3
                </span>

                {activeTab === "received" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#5B3CC4]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("given")}
                className={`relative pb-4 text-sm font-bold transition ${
                  activeTab === "given"
                    ? "text-[#5B3CC4]"
                    : "text-[#8A92A2] hover:text-[#596273]"
                }`}
              >
                Given
                <span className="ml-2 rounded-full bg-[#F1EEFF] px-2 py-0.5 text-[10px]">
                  3
                </span>

                {activeTab === "given" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#5B3CC4]" />
                )}
              </button>

            </div>

          </div>

          {/* Search + filters */}

          <div className="border-b border-[#E8EAF0] p-6 sm:p-8">

            <div className="relative mb-5">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
              />

              <label htmlFor="kudos-search" className="sr-only">
                Search kudos
              </label>

              <input
                id="kudos-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by person, category or message..."
                className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-[#FAFBFC] pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#B9A9EA] focus:bg-white focus:ring-4 focus:ring-[#F1EEFF]"
              />

            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "bg-[#5B3CC4] text-white"
                      : "border border-[#E2E5EB] bg-white text-[#687383] hover:border-[#D5CFF0] hover:text-[#5B3CC4]"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>

          {/* Results */}

          <div className="p-6 sm:p-8">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-[#18212F]">
                  {activeTab === "received"
                    ? "Recognition you've received"
                    : "Recognition you've given"}
                </h2>

                <p className="mt-1 text-xs text-[#9BA3B0]">
                  {filteredKudos.length} recognition
                  {filteredKudos.length === 1 ? "" : "s"} found
                </p>
              </div>

            </div>

            <div className="space-y-4">

              {filteredKudos.map((item) => {

                const isLiked = liked.includes(item.id);
                const isExpanded = expanded.includes(item.id);

                return (
                  <article
                    key={item.id}
                    className="rounded-[22px] border border-[#E8EAF0] bg-white p-5 transition hover:border-[#DDD6F4] hover:shadow-[0_10px_30px_rgba(31,35,55,0.05)]"
                  >

                    <div className="flex gap-4">

                      {/* Icon */}

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F1EEFF] text-2xl">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">

                        {/* Top row */}

                        <div className="flex flex-wrap items-start justify-between gap-2">

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7257C7]">
                              {item.category}
                            </span>

                            <p className="mt-1 text-sm font-bold text-[#18212F]">
                              {activeTab === "received"
                                ? `${item.sender} recognized you`
                                : `You recognized ${item.receiver}`}
                            </p>
                          </div>

                          <span className="text-[11px] text-[#A0A7B4]">
                            {item.date}
                          </span>

                        </div>

                        {/* Message */}

                        <p
                          className={`mt-3 text-sm leading-7 text-[#687383] ${
                            !isExpanded ? "line-clamp-2" : ""
                          }`}
                        >
                          "{item.message}"
                        </p>

                        {item.message.length > 120 && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="mt-1 text-xs font-semibold text-[#5B3CC4] hover:text-[#4D32AD]"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}

                        {/* Bottom */}

                        <div className="mt-4 flex flex-wrap items-center gap-2">

                          <button
                            onClick={() => toggleLike(item.id)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              isLiked
                                ? "bg-[#FFF0F3] text-[#D95169]"
                                : "bg-[#F7F8FC] text-[#687383] hover:bg-[#FFF0F3] hover:text-[#D95169]"
                            }`}
                          >
                            <Heart
                              size={13}
                              fill={isLiked ? "currentColor" : "none"}
                            />
                            {item.reactions.heart + (isLiked ? 1 : 0)}
                          </button>

                          <button className="flex items-center gap-1.5 rounded-full bg-[#F7F8FC] px-3 py-1.5 text-xs font-semibold text-[#687383] hover:bg-[#EEF4FF] hover:text-[#3C6FC5]">
                            <ThumbsUp size={13} />
                            {item.reactions.clap}
                          </button>

                          <button className="flex items-center gap-1.5 rounded-full bg-[#F7F8FC] px-3 py-1.5 text-xs font-semibold text-[#687383] hover:bg-[#FFF4EA] hover:text-[#D76C2C]">
                            <Flame size={13} />
                            {item.reactions.fire}
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

            {/* Empty state */}

            {filteredKudos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#D9DCE4] px-6 py-14 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEFF] text-[#5B3CC4]">
                  <Search size={21} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#18212F]">
                  No recognition found
                </h3>

                <p className="mt-2 text-sm text-[#8A92A2]">
                  Try changing your search or category filter.
                </p>

              </div>
            )}

          </div>

        </section>

        {/* CTA */}

        <section className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-[#E8EAF0] bg-white p-6 sm:flex-row">

          <div>
            <p className="text-sm font-bold text-[#18212F]">
              Someone made a difference?
            </p>

            <p className="mt-1 text-xs text-[#8A92A2]">
              Give them a Kudos and let them know.
            </p>
          </div>

          <Link
            href="/give-kudos"
            className="flex items-center gap-2 rounded-xl bg-[#5B3CC4] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#4D32AD]"
          >
            Give Kudos
            <ArrowRight size={14} />
          </Link>

        </section>

      </main>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  value,
  label,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-[#E8EAF0] bg-white p-5">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-[30px] font-bold tracking-[-0.04em] text-[#18212F]">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#303A48]">
        {label}
      </p>

      <p className="mt-1 text-xs text-[#9BA3B0]">
        {detail}
      </p>

    </div>
  );
}