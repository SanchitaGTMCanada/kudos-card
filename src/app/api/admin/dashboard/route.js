"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Flame,
  Loader2,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/dashboard",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load dashboard."
        );
      }

      setData(result);
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <div className="flex items-center gap-3 text-sm font-medium text-[#596273]">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F8FC] px-5 py-10">
        <div className="mx-auto max-w-[900px] rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const summary =
    data?.summary || {};

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7B8493]">
              Administration
            </p>

            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#18212F]">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#70798A]">
              Organization-wide Kudos and
              recognition overview.
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E8EAF0] bg-white px-4 py-2.5 text-xs font-semibold text-[#70798A] shadow-sm">

            <CalendarDays size={15} />

            Current Month

          </div>

        </div>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            title="Total Employees"
            value={
              summary.totalEmployees || 0
            }
            subtitle="Registered employees"
            icon={<Users size={21} />}
            iconClass="bg-[#F1EEFF] text-[#5B3CC4]"
          />

          <SummaryCard
            title="Active Employees"
            value={
              summary.activeEmployees || 0
            }
            subtitle="Currently active"
            icon={
              <CheckCircle2 size={21} />
            }
            iconClass="bg-[#EAF9F1] text-[#1F9D62]"
          />

          <SummaryCard
            title="Total Kudos"
            value={
              summary.totalKudos || 0
            }
            subtitle="Active recognition"
            icon={<Award size={21} />}
            iconClass="bg-[#FFF2E8] text-[#E87524]"
          />

          <SummaryCard
            title="Kudos This Month"
            value={
              summary.kudosThisMonth || 0
            }
            subtitle="Current month"
            icon={<Flame size={21} />}
            iconClass="bg-[#FFF1F3] text-[#D45568]"
          />

        </div>

        {/* =====================================================
            TOP RECOGNIZED + TOP GIVERS
        ===================================================== */}

        <div className="mb-8 grid gap-6 xl:grid-cols-2">

          <RankingCard
            title="Top Recognized Employees"
            subtitle="Employees receiving the most Kudos"
            icon={
              <Trophy size={20} />
            }
            data={
              data?.topRecognized || []
            }
            emptyText="No Kudos have been received yet."
          />

          <RankingCard
            title="Top Kudos Givers"
            subtitle="Employees giving the most Kudos"
            icon={
              <TrendingUp size={20} />
            }
            data={
              data?.topGivers || []
            }
            emptyText="No Kudos have been sent yet."
          />

        </div>

        {/* =====================================================
            LOWER SECTION
        ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-2">

          {/* Category Distribution */}

          <CategoryCard
            data={
              data?.categoryDistribution ||
              []
            }
          />

          {/* Monthly Trend */}

          <MonthlyTrend
            data={
              data?.monthlyTrend || []
            }
          />

        </div>

      </div>
    </main>
  );
}

/* =============================================================
   SUMMARY CARD
============================================================= */

function SummaryCard({
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

          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A92A2]">
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

/* =============================================================
   RANKING CARD
============================================================= */

function RankingCard({
  title,
  subtitle,
  icon,
  data,
  emptyText,
}) {
  return (
    <section className="rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

      <div className="border-b border-[#EEF0F4] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFF] text-[#5B3CC4]">
            {icon}
          </div>

          <div>

            <h2 className="text-base font-bold text-[#18212F]">
              {title}
            </h2>

            <p className="mt-1 text-xs text-[#8A92A2]">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

      {data.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center px-5 text-center">

          <p className="text-sm text-[#8A92A2]">
            {emptyText}
          </p>

        </div>
      ) : (
        <div className="divide-y divide-[#EEF0F4]">

          {data.map(
            (item, index) => (
              <div
                key={
                  item.user?.id ||
                  index
                }
                className="flex items-center gap-4 px-5 py-4"
              >

                {/* Rank */}

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F8FC] text-xs font-bold text-[#7B8493]">
                  {index + 1}
                </div>

                {/* Avatar */}

                {item.user
                  ?.profileImage ? (
                  <img
                    src={
                      item.user
                        .profileImage
                    }
                    alt={
                      item.user.name
                    }
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                    {getInitials(
                      item.user?.name
                    )}
                  </div>
                )}

                {/* User */}

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-bold text-[#18212F]">
                    {item.user?.name ||
                      "Unknown"}
                  </p>

                  <p className="truncate text-xs text-[#8A92A2]">
                    {item.user
                      ?.employeeId ||
                      ""}
                  </p>

                </div>

                {/* Count */}

                <div className="text-right">

                  <p className="text-lg font-bold text-[#5B3CC4]">
                    {item.count}
                  </p>

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9AA1AD]">
                    Kudos
                  </p>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </section>
  );
}

/* =============================================================
   CATEGORY CARD
============================================================= */

function CategoryCard({
  data,
}) {
  const total = data.reduce(
    (sum, item) =>
      sum + item.count,
    0
  );

  return (
    <section className="rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

      <div className="border-b border-[#EEF0F4] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8] text-[#E87524]">
            <BarChart3 size={20} />
          </div>

          <div>

            <h2 className="text-base font-bold text-[#18212F]">
              Category Distribution
            </h2>

            <p className="mt-1 text-xs text-[#8A92A2]">
              How employees are being
              recognized
            </p>

          </div>

        </div>

      </div>

      <div className="p-5">

        {data.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center text-sm text-[#8A92A2]">
            No category data available.
          </div>
        ) : (
          <div className="space-y-5">

            {data.map(
              (item) => {
                const percentage =
                  total > 0
                    ? Math.round(
                        (item.count /
                          total) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={
                      item.category?.id
                    }
                  >

                    <div className="mb-2 flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-2">

                        <span className="text-lg">
                          {
                            item
                              .category
                              ?.icon
                          }
                        </span>

                        <span className="truncate text-sm font-semibold text-[#596273]">
                          {
                            item
                              .category
                              ?.name
                          }
                        </span>

                      </div>

                      <span className="shrink-0 text-xs font-bold text-[#18212F]">
                        {item.count}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#F0F1F4]">

                      <div
                        className="h-full rounded-full bg-[#5B3CC4] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <p className="mt-1 text-right text-[10px] font-medium text-[#9AA1AD]">
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
  );
}

/* =============================================================
   MONTHLY TREND
============================================================= */

function MonthlyTrend({
  data,
}) {
  const max = Math.max(
    ...data.map(
      (item) => item.count
    ),
    1
  );

  return (
    <section className="rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

      <div className="border-b border-[#EEF0F4] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF9F1] text-[#1F9D62]">
            <TrendingUp size={20} />
          </div>

          <div>

            <h2 className="text-base font-bold text-[#18212F]">
              Monthly Kudos Trend
            </h2>

            <p className="mt-1 text-xs text-[#8A92A2]">
              Recognition activity over the
              last 6 months
            </p>

          </div>

        </div>

      </div>

      <div className="p-5">

        {data.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center text-sm text-[#8A92A2]">
            No trend data available.
          </div>
        ) : (
          <div className="flex h-[260px] items-end gap-3">

            {data.map(
              (item, index) => {
                const height =
                  Math.max(
                    (item.count /
                      max) *
                      100,
                    item.count > 0
                      ? 8
                      : 2
                  );

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <div className="mb-2 text-xs font-bold text-[#596273]">
                      {item.count}
                    </div>

                    <div className="flex h-[190px] w-full items-end">

                      <div
                        className="mx-auto w-full max-w-[42px] rounded-t-xl bg-[#5B3CC4] transition-all duration-500"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 text-xs font-semibold text-[#8A92A2]">
                      {item.month}
                    </div>

                    <div className="text-[10px] text-[#B0B5BF]">
                      {item.year}
                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

/* =============================================================
   INITIALS
============================================================= */

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}