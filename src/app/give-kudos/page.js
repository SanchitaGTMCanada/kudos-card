"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";

const employees = [
  {
    id: 1,
    name: "Priya Das",
    role: "Software Developer",
    initials: "PD",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    role: "Software Engineer",
    initials: "RS",
  },
  {
    id: 3,
    name: "Amit Roy",
    role: "Sales Executive",
    initials: "AR",
  },
  {
    id: 4,
    name: "Neha Sen",
    role: "Operations Executive",
    initials: "NS",
  },
];

const categories = [
  {
    id: "great-work",
    icon: "⭐",
    title: "Great Work",
    description: "For excellent results",
  },
  {
    id: "team-player",
    icon: "🤝",
    title: "Team Player",
    description: "For supporting others",
  },
  {
    id: "innovation",
    icon: "💡",
    title: "Innovation",
    description: "For creative thinking",
  },
  {
    id: "extra-mile",
    icon: "🚀",
    title: "Going Extra Mile",
    description: "For going above & beyond",
  },
  {
    id: "problem-solver",
    icon: "🧩",
    title: "Problem Solver",
    description: "For solving challenges",
  },
];

export default function GiveKudosPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  const canPreview =
    selectedEmployee &&
    selectedCategory &&
    message.trim().length >= 10;

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
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B3CC4] text-white">
              <Sparkles size={17} />
            </div>

            <span className="text-[16px] font-bold text-[#18212F]">
              Kudos Card
            </span>
          </div>

          <div className="w-[140px]" />

        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 py-10 lg:px-8">

        {/* Heading */}

        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5B3CC4]">
            <Sparkles size={13} />
            Recognition
          </div>

          <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18212F] sm:text-[42px]">
            Give someone a Kudos 🎉
          </h1>

          <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-7 text-[#70798A]">
            Celebrate a colleague who made a difference.
            Tell them what they did well and why it mattered.
          </p>
        </div>

        {/* Employee */}

        <section className="rounded-[24px] border border-[#E8EAF0] bg-white p-6 sm:p-8">

          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8A92A2]">
              Step 01
            </p>

            <h2 className="mt-1 text-[21px] font-bold text-[#18212F]">
              Who would you like to appreciate?
            </h2>
          </div>

          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-[#FAFBFC] pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#B9A9EA] focus:bg-white focus:ring-4 focus:ring-[#F1EEFF]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredEmployees.map((employee) => {
              const selected = selectedEmployee?.id === employee.id;

              return (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`relative rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#7257C7] bg-[#F8F6FF] ring-2 ring-[#E9E3FF]"
                      : "border-[#E8EAF0] bg-white hover:border-[#D7D0F0] hover:bg-[#FCFBFF]"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#7257C7] text-white">
                      <Check size={13} />
                    </span>
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E1FF] text-sm font-bold text-[#5B3CC4]">
                    {employee.initials}
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#18212F]">
                    {employee.name}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8A92A2]">
                    {employee.role}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Category */}

        <section className="mt-5 rounded-[24px] border border-[#E8EAF0] bg-white p-6 sm:p-8">

          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8A92A2]">
              Step 02
            </p>

            <h2 className="mt-1 text-[21px] font-bold text-[#18212F]">
              What are you recognizing?
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const selected = selectedCategory?.id === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-[#7257C7] bg-[#F8F6FF] ring-2 ring-[#E9E3FF]"
                      : "border-[#E8EAF0] hover:border-[#D7D0F0] hover:bg-[#FCFBFF]"
                  }`}
                >
                  <div className="text-2xl">
                    {category.icon}
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#18212F]">
                    {category.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8A92A2]">
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Message */}

        <section className="mt-5 rounded-[24px] border border-[#E8EAF0] bg-white p-6 sm:p-8">

          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8A92A2]">
                Step 03
              </p>

              <h2 className="mt-1 text-[21px] font-bold text-[#18212F]">
                Write your appreciation
              </h2>
            </div>

            <span className="text-[11px] text-[#A0A7B4]">
              {message.length}/500
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Tell them what they did and why you appreciate it..."
            rows={6}
            className="w-full resize-none rounded-2xl border border-[#E2E5EB] bg-[#FAFBFC] p-5 text-sm leading-7 text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#B9A9EA] focus:bg-white focus:ring-4 focus:ring-[#F1EEFF]"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-[#A0A7B4]">
              A specific message makes recognition more meaningful.
            </p>

            <span
              className={`text-[11px] font-semibold ${
                message.length >= 10
                  ? "text-[#2E9B63]"
                  : "text-[#A0A7B4]"
              }`}
            >
              {message.length >= 10 ? "Ready" : "10 characters minimum"}
            </span>
          </div>
        </section>

        {/* Action */}

        <div className="mt-7 flex justify-end">
          <button
            disabled={!canPreview}
            onClick={() => setShowPreview(true)}
            className={`group flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition ${
              canPreview
                ? "bg-[#5B3CC4] shadow-[0_12px_30px_rgba(91,60,196,0.22)] hover:-translate-y-0.5 hover:bg-[#4D32AD]"
                : "cursor-not-allowed bg-[#C7C3D4]"
            }`}
          >
            Preview Kudos
            <ChevronRight
              size={16}
              className={canPreview ? "transition-transform group-hover:translate-x-0.5" : ""}
            />
          </button>
        </div>

      </main>

      {/* Preview Modal */}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18212F]/50 px-5 backdrop-blur-sm">

          <div className="w-full max-w-[520px] rounded-[28px] bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8A92A2]">
                  Preview
                </p>

                <h3 className="mt-1 text-xl font-bold text-[#18212F]">
                  Your Kudos Card
                </h3>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="text-sm font-semibold text-[#8A92A2] hover:text-[#18212F]"
              >
                Close
              </button>
            </div>

            <div className="rounded-[24px] bg-gradient-to-br from-[#F4F0FF] via-white to-[#FFF8E9] p-7 text-center">

              <div className="text-4xl">
                {selectedCategory.icon}
              </div>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7257C7]">
                {selectedCategory.title}
              </p>

              <h4 className="mt-4 text-2xl font-bold text-[#18212F]">
                {selectedEmployee.name}
              </h4>

              <p className="mx-auto mt-5 max-w-[390px] text-sm leading-7 text-[#687383]">
                "{message}"
              </p>

              <p className="mt-6 text-xs font-semibold text-[#8A92A2]">
                From Sanchita Sharma
              </p>

            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 rounded-xl border border-[#E2E5EB] px-5 py-3 text-sm font-semibold text-[#596273] hover:bg-[#F7F8FC]"
              >
                Edit
              </button>

              <button
                onClick={() => alert("Kudos sent! 🎉")}
                className="flex-1 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white hover:bg-[#4D32AD]"
              >
                🎉 Send Kudos
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}