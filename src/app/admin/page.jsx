"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  ChevronRight,
  Crown,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/report",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load admin report."
        );
      }

      setReport(result.report);
    } catch (error) {
      console.error(
        "Admin report error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8FC]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-[#596273]">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span className="text-sm font-medium">
              Loading admin dashboard...
            </span>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F8FC] p-6">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadReport}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9E1FF] text-[#5B3CC4]">
                <ShieldCheck size={19} />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7B8493]">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#18212F]">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#70798A]">
              Monitor employee recognition and Kudos activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E5EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#596273] shadow-sm transition hover:bg-[#F7F8FC]"
          >
            <BarChart3 size={17} />
            Refresh Report
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Employees"
            value={report.totalEmployees}
            subtitle={`${report.activeEmployees} active employees`}
            icon={<Users size={21} />}
            iconClass="bg-[#EEF4FF] text-[#3975D3]"
          />

          <StatCard
            title="Total Kudos"
            value={report.totalKudos}
            subtitle="All active Kudos"
            icon={<Award size={21} />}
            iconClass="bg-[#FFF4E5] text-[#E68A00]"
          />

          <StatCard
            title="This Month"
            value={report.monthlyKudos}
            subtitle="Kudos sent this month"
            icon={<Sparkles size={21} />}
            iconClass="bg-[#F1EEFF] text-[#5B3CC4]"
          />

          <StatCard
            title="Active Employees"
            value={report.activeEmployees}
            subtitle="Currently active"
            icon={<ShieldCheck size={21} />}
            iconClass="bg-[#EAF9F1] text-[#1F9D62]"
          />

        </div>

        {/* =====================================================
            REPORT GRID
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* ===================================================
              TOP RECOGNIZED
          ==================================================== */}

          <section className="rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-[#EEF0F4] px-6 py-5">
              <div>
                <h2 className="text-base font-bold text-[#18212F]">
                  Top Recognized Employees
                </h2>

                <p className="mt-1 text-xs text-[#8A92A2]">
                  Employees who received the most Kudos
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E5] text-[#E68A00]">
                <Crown size={18} />
              </div>
            </div>

            <div className="p-4">

              {report.topEmployees.length === 0 ? (
                <EmptyState text="No Kudos have been sent yet." />
              ) : (
                <div className="space-y-2">

                  {report.topEmployees.map(
                    (employee, index) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#F7F8FC]"
                      >

                        {/* Rank */}

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1EEFF] text-xs font-bold text-[#5B3CC4]">
                          {index + 1}
                        </div>

                        {/* Avatar */}

                        {employee.profileImage ? (
                          <img
                            src={employee.profileImage}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                            {getInitials(
                              employee.name
                            )}
                          </div>
                        )}

                        {/* Employee */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#18212F]">
                            {employee.name}
                          </p>

                          <p className="truncate text-xs text-[#8A92A2]">
                            {employee.designation ||
                              "Employee"}
                          </p>
                        </div>

                        {/* Count */}

                        <div className="text-right">
                          <p className="text-sm font-bold text-[#18212F]">
                            {employee.kudosCount}
                          </p>

                          <p className="text-[10px] uppercase tracking-wide text-[#9AA1AD]">
                            Kudos
                          </p>
                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>

          {/* ===================================================
              CATEGORY REPORT
          ==================================================== */}

          <section className="rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-[#EEF0F4] px-6 py-5">
              <div>
                <h2 className="text-base font-bold text-[#18212F]">
                  Kudos by Category
                </h2>

                <p className="mt-1 text-xs text-[#8A92A2]">
                  Recognition distribution
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EEFF] text-[#5B3CC4]">
                <BarChart3 size={18} />
              </div>
            </div>

            <div className="p-6">

              {report.categoryStats.length === 0 ? (
                <EmptyState text="No category data available." />
              ) : (
                <div className="space-y-5">

                  {report.categoryStats.map(
                    (category) => {

                      const percentage =
                        report.totalKudos > 0
                          ? Math.round(
                              (category.count /
                                report.totalKudos) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={category.id}
                        >

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {category.icon}
                              </span>

                              <span className="text-sm font-semibold text-[#596273]">
                                {category.name}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-[#18212F]">
                              {category.count}
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-[#F0F1F5]">
                            <div
                              className="h-full rounded-full bg-[#5B3CC4] transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <p className="mt-1 text-right text-[10px] text-[#9AA1AD]">
                            {percentage}%
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </section>

        </div>

        {/* =====================================================
            RECENT KUDOS
        ====================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-[#EEF0F4] px-6 py-5">

            <div>
              <h2 className="text-base font-bold text-[#18212F]">
                Recent Kudos
              </h2>

              <p className="mt-1 text-xs text-[#8A92A2]">
                Latest recognition activity
              </p>
            </div>

            <Award
              size={20}
              className="text-[#7B8493]"
            />

          </div>

          {report.recentKudos.length === 0 ? (
            <div className="p-8">
              <EmptyState text="No Kudos have been sent yet." />
            </div>
          ) : (
            <div className="divide-y divide-[#EEF0F4]">

              {report.recentKudos.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#FCFCFD] md:flex-row md:items-center"
                >

                  {/* Sender */}

                  <div className="flex min-w-[220px] items-center gap-3">

                    {item.sender.profileImage ? (
                      <img
                        src={item.sender.profileImage}
                        alt={item.sender.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                        {getInitials(
                          item.sender.name
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#18212F]">
                        {item.sender.name}
                      </p>

                      <p className="text-xs text-[#8A92A2]">
                        {item.sender.employeeId}
                      </p>
                    </div>

                  </div>

                  <ChevronRight
                    size={16}
                    className="hidden shrink-0 text-[#B0B5BF] md:block"
                  />

                  {/* Receiver */}

                  <div className="flex min-w-[220px] items-center gap-3">

                    {item.receiver.profileImage ? (
                      <img
                        src={item.receiver.profileImage}
                        alt={item.receiver.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-xs font-bold text-[#3975D3]">
                        {getInitials(
                          item.receiver.name
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#18212F]">
                        {item.receiver.name}
                      </p>

                      <p className="text-xs text-[#8A92A2]">
                        {item.receiver.employeeId}
                      </p>
                    </div>

                  </div>

                  {/* Message */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {item.category.icon}
                      </span>

                      <span className="text-xs font-bold text-[#5B3CC4]">
                        {item.category.name}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-[#596273]">
                      {item.message}
                    </p>

                  </div>

                  {/* Date */}

                  <div className="shrink-0 text-xs text-[#9AA1AD]">
                    {formatDate(item.createdAt)}
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

// =============================================================
// STAT CARD
// =============================================================

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-[#E8EAF0] bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8A92A2]">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#18212F]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#9AA1AD]">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-center">
      <p className="text-sm text-[#9AA1AD]">
        {text}
      </p>
    </div>
  );
}

// =============================================================
// INITIALS
// =============================================================

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// =============================================================
// DATE
// =============================================================

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}