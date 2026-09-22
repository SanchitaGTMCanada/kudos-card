"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Award,
  CheckCircle2,
  Flame,
  Heart,
  Loader2,
  MessageCircle,
  RotateCcw,
  Search,
  UserX,
} from "lucide-react";

export default function AdminKudosPage() {
  const [kudos, setKudos] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    thisMonth: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadKudos();
  }, []);

  async function loadKudos() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "ALL") {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/admin/kudos?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load Kudos."
        );
      }

      setKudos(result.kudos || []);

      setSummary(
        result.summary || {
          total: 0,
          active: 0,
          inactive: 0,
          thisMonth: 0,
        }
      );
    } catch (error) {
      console.error(
        "Admin Kudos loading error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load Kudos."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateKudosStatus(item) {
    if (updatingId) return;

    const nextStatus =
      item.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const confirmed = window.confirm(
      nextStatus === "INACTIVE"
        ? "Are you sure you want to deactivate this Kudos?"
        : "Restore this Kudos?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(item.id);

      const response = await fetch(
        "/api/admin/kudos",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kudosId: item.id,
            status: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update Kudos."
        );
      }

      setKudos((current) =>
        current.map((kudosItem) =>
          kudosItem.id === item.id
            ? {
                ...kudosItem,
                status: nextStatus,
              }
            : kudosItem
        )
      );

      setSummary((current) => ({
        ...current,

        active:
          current.active +
          (nextStatus === "ACTIVE"
            ? 1
            : -1),

        inactive:
          current.inactive +
          (nextStatus === "INACTIVE"
            ? 1
            : -1),
      }));
    } catch (error) {
      console.error(
        "Kudos status update error:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to update Kudos."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const visibleKudos = useMemo(() => {
    return kudos;
  }, [kudos]);

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8">

        {/* Header */}

        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7B8493]">
            Administration
          </p>

          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#18212F]">
            Kudos Management
          </h1>

          <p className="mt-2 text-sm text-[#70798A]">
            Review and manage recognition shared
            across the organization.
          </p>
        </div>

        {/* Summary */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Total Kudos"
            value={summary.total}
            icon={<Award size={21} />}
            iconClass="bg-[#F1EEFF] text-[#5B3CC4]"
          />

          <SummaryCard
            label="This Month"
            value={summary.thisMonth}
            icon={<Flame size={21} />}
            iconClass="bg-[#FFF2E8] text-[#E87524]"
          />

          <SummaryCard
            label="Active"
            value={summary.active}
            icon={<CheckCircle2 size={21} />}
            iconClass="bg-[#EAF9F1] text-[#1F9D62]"
          />

          <SummaryCard
            label="Inactive"
            value={summary.inactive}
            icon={<UserX size={21} />}
            iconClass="bg-[#FFF1F3] text-[#D45568]"
          />

        </div>

        {/* Main */}

        <section className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b border-[#EEF0F4] p-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-base font-bold text-[#18212F]">
                All Kudos
              </h2>

              <p className="mt-1 text-xs text-[#8A92A2]">
                {visibleKudos.length} record
                {visibleKudos.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}

              <div className="relative sm:w-[300px]">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA1AD]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      loadKudos();
                    }
                  }}
                  placeholder="Search Kudos..."
                  className="h-11 w-full rounded-xl border border-[#E2E5EB] bg-[#FCFCFD] pl-10 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF]"
                />

              </div>

              {/* Status */}

              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);

                  setTimeout(
                    loadKudos,
                    0
                  );
                }}
                className="h-11 rounded-xl border border-[#E2E5EB] bg-white px-4 text-sm font-medium text-[#596273] outline-none focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF]"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>
              </select>

              <button
                type="button"
                onClick={loadKudos}
                className="h-11 rounded-xl bg-[#5B3CC4] px-5 text-sm font-bold text-white transition hover:bg-[#4D32AD]"
              >
                Search
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-[#596273]">
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Loading Kudos...
              </div>
            </div>
          ) : visibleKudos.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop */}

              <div className="hidden overflow-x-auto xl:block">

                <table className="w-full min-w-[1200px]">

                  <thead>
                    <tr className="border-b border-[#EEF0F4] bg-[#FCFCFD] text-left">

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Sender
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Receiver
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Message
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEF0F4]">

                    {visibleKudos.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-[#FCFCFD]"
                        >

                          <td className="px-6 py-5">
                            <Person
                              person={
                                item.sender
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <Person
                              person={
                                item.receiver
                              }
                            />
                          </td>

                          <td className="px-6 py-5">

                            <div className="inline-flex items-center gap-2 rounded-xl bg-[#F7F8FC] px-3 py-2">

                              <span className="text-lg">
                                {
                                  item
                                    .category
                                    ?.icon
                                }
                              </span>

                              <span className="text-sm font-semibold text-[#596273]">
                                {
                                  item
                                    .category
                                    ?.name
                                }
                              </span>

                            </div>

                          </td>

                          <td className="max-w-[280px] px-6 py-5">

                            <div className="flex gap-2">

                              <MessageCircle
                                size={16}
                                className="mt-0.5 shrink-0 text-[#9AA1AD]"
                              />

                              <p className="line-clamp-2 text-sm leading-6 text-[#596273]">
                                {
                                  item.message
                                }
                              </p>

                            </div>

                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-[#70798A]">
                            {formatDate(
                              item.createdAt
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                item.status
                              }
                            />
                          </td>

                          <td className="px-6 py-5 text-right">

                            <ActionButton
                              item={item}
                              updatingId={
                                updatingId
                              }
                              onClick={
                                updateKudosStatus
                              }
                            />

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* Tablet / Mobile */}

              <div className="divide-y divide-[#EEF0F4] xl:hidden">

                {visibleKudos.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EEFF] text-xl">
                            {
                              item
                                .category
                                ?.icon
                            }
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-[#18212F]">
                              {
                                item
                                  .category
                                  ?.name
                              }
                            </p>

                            <p className="text-xs text-[#8A92A2]">
                              {formatDate(
                                item.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                        <StatusBadge
                          status={
                            item.status
                          }
                        />

                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        <PersonBlock
                          label="From"
                          person={
                            item.sender
                          }
                        />

                        <PersonBlock
                          label="To"
                          person={
                            item.receiver
                          }
                        />

                      </div>

                      <div className="mt-4 rounded-xl bg-[#F8F9FB] p-4">

                        <p className="text-sm leading-6 text-[#596273]">
                          {item.message}
                        </p>

                      </div>

                      <ActionButton
                        item={item}
                        updatingId={
                          updatingId
                        }
                        onClick={
                          updateKudosStatus
                        }
                        fullWidth
                      />

                    </div>
                  )
                )}

              </div>
            </>
          )}

        </section>

      </div>
    </main>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#E8EAF0] bg-white p-5 shadow-sm">

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8A92A2]">
          {label}
        </p>

        <p className="mt-2 text-2xl font-bold text-[#18212F]">
          {value}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

    </div>
  );
}

/* ============================================================
   PERSON
============================================================ */

function Person({ person }) {
  return (
    <div className="flex items-center gap-3">

      {person?.profileImage ? (
        <img
          src={person.profileImage}
          alt={person.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
          {getInitials(person?.name)}
        </div>
      )}

      <div className="min-w-0">

        <p className="truncate text-sm font-semibold text-[#18212F]">
          {person?.name || "Unknown"}
        </p>

        <p className="truncate text-xs text-[#8A92A2]">
          {person?.employeeId || ""}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   PERSON BLOCK
============================================================ */

function PersonBlock({
  label,
  person,
}) {
  return (
    <div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA1AD]">
        {label}
      </p>

      <Person person={person} />

    </div>
  );
}

/* ============================================================
   STATUS
============================================================ */

function StatusBadge({ status }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        active
          ? "bg-[#EAF9F1] text-[#1F9D62]"
          : "bg-[#FFF1F3] text-[#D45568]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[#1F9D62]"
            : "bg-[#D45568]"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

function ActionButton({
  item,
  updatingId,
  onClick,
  fullWidth = false,
}) {
  const loading =
    updatingId === item.id;

  const active = item.status === "ACTIVE";

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onClick(item)}
      className={`${
        fullWidth
          ? "mt-4 w-full"
          : ""
      } inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "bg-[#FFF1F3] text-[#D45568] hover:bg-[#FFE5E9]"
          : "bg-[#EAF9F1] text-[#1F9D62] hover:bg-[#DDF5E8]"
      }`}
    >
      {loading ? (
        <Loader2
          size={15}
          className="animate-spin"
        />
      ) : active ? (
        <UserX size={15} />
      ) : (
        <RotateCcw size={15} />
      )}

      {active
        ? "Deactivate"
        : "Restore"}
    </button>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState() {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EEFF] text-[#5B3CC4]">
        <Heart size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#18212F]">
        No Kudos found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-[#8A92A2]">
        No Kudos match the current search or
        status filter.
      </p>

    </div>
  );
}

/* ============================================================
   DATE
============================================================ */

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* ============================================================
   INITIALS
============================================================ */

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