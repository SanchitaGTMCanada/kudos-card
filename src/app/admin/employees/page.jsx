"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Loader2,
  Mail,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/employees",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load employees."
        );
      }

      setEmployees(result.employees || []);
    } catch (error) {
      console.error(
        "Employee loading error:",
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

  async function toggleEmployeeStatus(employee) {
    if (updatingId) return;

    const nextStatus =
      employee.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const confirmed = window.confirm(
      nextStatus === "ACTIVE"
        ? `Activate ${employee.name}?`
        : `Deactivate ${employee.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(employee.id);

      const response = await fetch(
        "/api/admin/employees",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: employee.id,
            status: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update employee."
        );
      }

      setEmployees((current) =>
        current.map((item) =>
          item.id === employee.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Employee status update error:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to update employee."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredEmployees = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name
          ?.toLowerCase()
          .includes(value) ||
        employee.employeeId
          ?.toLowerCase()
          .includes(value) ||
        employee.email
          ?.toLowerCase()
          .includes(value) ||
        employee.designation
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [employees, search]);

  const activeCount = employees.filter(
    (employee) =>
      employee.status === "ACTIVE"
  ).length;

  const inactiveCount = employees.filter(
    (employee) =>
      employee.status !== "ACTIVE"
  ).length;

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">

        {/* Header */}

        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7B8493]">
            Administration
          </p>

          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#18212F]">
            Employees
          </h1>

          <p className="mt-2 text-sm text-[#70798A]">
            Manage employees and their account status.
          </p>
        </div>

        {/* Summary */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <SummaryCard
            label="Total Employees"
            value={employees.length}
            icon={<UserCheck size={20} />}
            className="bg-[#F1EEFF] text-[#5B3CC4]"
          />

          <SummaryCard
            label="Active"
            value={activeCount}
            icon={<CheckCircle2 size={20} />}
            className="bg-[#EAF9F1] text-[#1F9D62]"
          />

          <SummaryCard
            label="Inactive"
            value={inactiveCount}
            icon={<UserX size={20} />}
            className="bg-[#FFF1F3] text-[#D45568]"
          />

        </div>

        {/* Main Card */}

        <section className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b border-[#EEF0F4] p-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-base font-bold text-[#18212F]">
                Employee Directory
              </h2>

              <p className="mt-1 text-xs text-[#8A92A2]">
                {filteredEmployees.length} employee
                {filteredEmployees.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA1AD]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search employees..."
                className="h-11 w-full rounded-xl border border-[#E2E5EB] bg-[#FCFCFD] pl-10 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF]"
              />
            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={loadEmployees}
                className="mt-2 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-[#596273]">
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Loading employees...
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EEFF] text-[#5B3CC4]">
                <Search size={22} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#18212F]">
                No employees found
              </h3>

              <p className="mt-1 text-sm text-[#8A92A2]">
                Try changing your search.
              </p>

            </div>
          ) : (
            <>
              {/* Desktop */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-[#EEF0F4] bg-[#FCFCFD] text-left">

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Employee
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Employee ID
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Email
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#8A92A2]">
                        Designation
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

                    {filteredEmployees.map(
                      (employee) => (
                        <tr
                          key={employee.id}
                          className="transition hover:bg-[#FCFCFD]"
                        >

                          {/* Employee */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              {employee.profileImage ? (
                                <img
                                  src={
                                    employee.profileImage
                                  }
                                  alt={
                                    employee.name
                                  }
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                                  {getInitials(
                                    employee.name
                                  )}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#18212F]">
                                  {employee.name}
                                </p>

                                <p className="text-xs text-[#8A92A2]">
                                  Employee
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* ID */}

                          <td className="px-6 py-4">
                            <span className="rounded-lg bg-[#F7F8FC] px-2.5 py-1 text-xs font-semibold text-[#596273]">
                              {employee.employeeId}
                            </span>
                          </td>

                          {/* Email */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-[#596273]">
                              <Mail
                                size={15}
                                className="text-[#9AA1AD]"
                              />

                              {employee.email}
                            </div>
                          </td>

                          {/* Designation */}

                          <td className="px-6 py-4 text-sm text-[#596273]">
                            {employee.designation ||
                              "—"}
                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">
                            <StatusBadge
                              status={
                                employee.status
                              }
                            />
                          </td>

                          {/* Action */}

                          <td className="px-6 py-4 text-right">

                            <button
                              type="button"
                              disabled={
                                updatingId ===
                                employee.id
                              }
                              onClick={() =>
                                toggleEmployeeStatus(
                                  employee
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                employee.status ===
                                "ACTIVE"
                                  ? "bg-[#FFF1F3] text-[#D45568] hover:bg-[#FFE5E9]"
                                  : "bg-[#EAF9F1] text-[#1F9D62] hover:bg-[#DDF5E8]"
                              }`}
                            >

                              {updatingId ===
                              employee.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : employee.status ===
                                "ACTIVE" ? (
                                <UserX size={14} />
                              ) : (
                                <UserCheck size={14} />
                              )}

                              {employee.status ===
                              "ACTIVE"
                                ? "Deactivate"
                                : "Activate"}

                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* Mobile */}

              <div className="divide-y divide-[#EEF0F4] md:hidden">

                {filteredEmployees.map(
                  (employee) => (
                    <div
                      key={employee.id}
                      className="p-5"
                    >

                      <div className="flex items-start gap-3">

                        {employee.profileImage ? (
                          <img
                            src={
                              employee.profileImage
                            }
                            alt={employee.name}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                            {getInitials(
                              employee.name
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-[#18212F]">
                            {employee.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#8A92A2]">
                            {employee.employeeId}
                          </p>

                        </div>

                        <StatusBadge
                          status={
                            employee.status
                          }
                        />

                      </div>

                      <div className="mt-4 space-y-2 text-sm">

                        <div className="flex items-center gap-2 text-[#596273]">
                          <Mail
                            size={15}
                            className="text-[#9AA1AD]"
                          />

                          <span className="truncate">
                            {employee.email}
                          </span>
                        </div>

                        <p className="text-xs text-[#8A92A2]">
                          {employee.designation ||
                            "Employee"}
                        </p>

                      </div>

                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          employee.id
                        }
                        onClick={() =>
                          toggleEmployeeStatus(
                            employee
                          )
                        }
                        className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition disabled:opacity-50 ${
                          employee.status ===
                          "ACTIVE"
                            ? "bg-[#FFF1F3] text-[#D45568]"
                            : "bg-[#EAF9F1] text-[#1F9D62]"
                        }`}
                      >

                        {updatingId ===
                        employee.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : employee.status ===
                          "ACTIVE" ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck
                            size={16}
                          />
                        )}

                        {employee.status ===
                        "ACTIVE"
                          ? "Deactivate Employee"
                          : "Activate Employee"}

                      </button>

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

// =============================================================
// SUMMARY CARD
// =============================================================

function SummaryCard({
  label,
  value,
  icon,
  className,
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
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

    </div>
  );
}

// =============================================================
// STATUS BADGE
// =============================================================

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