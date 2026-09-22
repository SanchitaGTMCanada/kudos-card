"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Search,
  Sparkles,
  Gift,
} from "lucide-react";
import Swal from "sweetalert2";

const MONTHLY_KUDOS_LIMIT = 2;

export default function GiveKudosPage() {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [message, setMessage] = useState("");

  const [employeeSearch, setEmployeeSearch] =
    useState("");

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingMonthlyLimit, setLoadingMonthlyLimit] =
    useState(true);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [showPreview, setShowPreview] =
    useState(false);

  // =========================================================
  // MONTHLY KUDOS STATE
  // =========================================================

  const [monthlyLimit, setMonthlyLimit] =
    useState(MONTHLY_KUDOS_LIMIT);

  const [usedThisMonth, setUsedThisMonth] =
    useState(0);

  const [remainingThisMonth, setRemainingThisMonth] =
    useState(MONTHLY_KUDOS_LIMIT);

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoadingEmployees(true);

        const response = await fetch("/api/users", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load employees"
          );
        }

        setEmployees(result.employees || []);
      } catch (error) {
        console.error(
          "Load employees error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load employees"
        );
      } finally {
        setLoadingEmployees(false);
      }
    }

    loadEmployees();
  }, []);

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          "/api/kudos/categories",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load categories"
          );
        }

        setCategories(result.categories || []);
      } catch (error) {
        console.error(
          "Load categories error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  // =========================================================
  // LOAD MONTHLY KUDOS LIMIT
  // =========================================================

  useEffect(() => {
    async function loadMonthlyLimit() {
      try {
        setLoadingMonthlyLimit(true);

        const response = await fetch(
          "/api/kudos/monthly-limit",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load monthly Kudos limit"
          );
        }

        setMonthlyLimit(
          result.monthlyLimit ??
            MONTHLY_KUDOS_LIMIT
        );

        setUsedThisMonth(
          result.usedThisMonth ?? 0
        );

        setRemainingThisMonth(
          result.remainingThisMonth ??
            Math.max(
              0,
              (result.monthlyLimit ??
                MONTHLY_KUDOS_LIMIT) -
                (result.usedThisMonth ?? 0)
            )
        );
      } catch (error) {
        console.error(
          "Load monthly Kudos limit error:",
          error
        );

        /*
         * Don't show a red error on the page just
         * because the counter API failed.
         *
         * The backend /api/kudos still protects
         * the actual monthly limit.
         */
      } finally {
        setLoadingMonthlyLimit(false);
      }
    }

    loadMonthlyLimit();
  }, []);

  // =========================================================
  // FILTER EMPLOYEES
  // =========================================================

  const filteredEmployees = useMemo(() => {
    const search =
      employeeSearch.trim().toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name
          ?.toLowerCase()
          .includes(search) ||
        employee.employeeId
          ?.toLowerCase()
          .includes(search) ||
        employee.designation
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [employees, employeeSearch]);

  // =========================================================
  // MONTHLY LIMIT STATUS
  // =========================================================

  const limitReached =
    usedThisMonth >= monthlyLimit;

  const usagePercentage =
    monthlyLimit > 0
      ? Math.min(
          100,
          (usedThisMonth / monthlyLimit) * 100
        )
      : 0;

  // =========================================================
  // INITIALS
  // =========================================================

  function getInitials(name) {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  }

  // =========================================================
  // MONTHLY LIMIT POPUP
  // =========================================================

  async function showMonthlyLimitPopup() {
    await Swal.fire({
      icon: "info",
      title: "Monthly Kudos Limit Reached",
      text: `You have already given ${monthlyLimit} Kudos this month. You can send more Kudos next month.`,
      confirmButtonText: "Okay",
      confirmButtonColor: "#5B3CC4",
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "rounded-xl px-5 py-2.5",
      },
    });
  }

  // =========================================================
  // SELECT EMPLOYEE
  // =========================================================

  function handleSelectEmployee(employee) {
    if (limitReached) {
      showMonthlyLimitPopup();
      return;
    }

    setSelectedEmployee(employee);
    setError("");
  }

  // =========================================================
  // SELECT CATEGORY
  // =========================================================

  function handleSelectCategory(category) {
    if (limitReached) {
      showMonthlyLimitPopup();
      return;
    }

    setSelectedCategory(category);
    setError("");
  }

  // =========================================================
  // OPEN PREVIEW
  // =========================================================

  function handlePreview() {
    setError("");

    if (limitReached) {
      showMonthlyLimitPopup();
      return;
    }

    if (!selectedEmployee) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (!selectedCategory) {
      setError(
        "Please select a Kudos category."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Please write a message."
      );
      return;
    }

    if (message.trim().length < 5) {
      setError(
        "Please write a little more in your message."
      );
      return;
    }

    setShowPreview(true);
  }

  // =========================================================
  // SEND KUDOS
  // =========================================================

  async function handleSendKudos() {
    setError("");

    /*
     * Frontend protection.
     */

    if (limitReached) {
      setShowPreview(false);

      await showMonthlyLimitPopup();

      return;
    }

    if (!selectedEmployee) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (!selectedCategory) {
      setError(
        "Please select a Kudos category."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Please write a message."
      );
      return;
    }

    if (message.trim().length < 5) {
      setError(
        "Please write a little more in your message."
      );
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        "/api/kudos",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            receiverId:
              selectedEmployee.id,

            categoryId:
              selectedCategory.id,

            message:
              message.trim(),
          }),
        }
      );

      const result =
        await response.json();

      // =====================================================
      // MONTHLY LIMIT RESPONSE
      // =====================================================

      if (
        result.limitReached === true
      ) {
        setMonthlyLimit(
          result.monthlyLimit ??
            MONTHLY_KUDOS_LIMIT
        );

        setUsedThisMonth(
          result.usedThisMonth ??
            MONTHLY_KUDOS_LIMIT
        );

        setRemainingThisMonth(
          result.remainingThisMonth ??
            0
        );

        setShowPreview(false);

        await showMonthlyLimitPopup();

        return;
      }

      // =====================================================
      // OTHER API ERRORS
      // =====================================================

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to send Kudos"
        );
      }

      // =====================================================
      // UPDATE MONTHLY USAGE
      // =====================================================

      const newUsedCount =
        result.usedThisMonth ??
        usedThisMonth + 1;

      const newRemainingCount =
        result.remainingThisMonth ??
        Math.max(
          0,
          monthlyLimit -
            newUsedCount
        );

      setMonthlyLimit(
        result.monthlyLimit ??
          MONTHLY_KUDOS_LIMIT
      );

      setUsedThisMonth(
        newUsedCount
      );

      setRemainingThisMonth(
        newRemainingCount
      );

      // =====================================================
      // CLOSE PREVIEW
      // =====================================================

      setShowPreview(false);

      // =====================================================
      // SUCCESS POPUP
      // =====================================================

      await Swal.fire({
        icon: "success",
        title: "Kudos Sent! 🎉",
        text:
          "Your appreciation has been sent successfully.",
        confirmButtonText: "Done",
        confirmButtonColor: "#5B3CC4",
        customClass: {
          popup: "rounded-2xl",
          confirmButton:
            "rounded-xl px-5 py-2.5",
        },
      });

      // =====================================================
      // REDIRECT
      // =====================================================

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "Send Kudos error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send Kudos"
      );
    } finally {
      setSending(false);
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-screen bg-[#F7F8FC]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center px-6 py-5 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#70798A] transition hover:text-[#5B3CC4]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-[1000px] px-6 py-10 lg:px-8">

        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
            <Sparkles size={13} />
            Employee Recognition
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F]">
            Give Kudos
          </h1>

          <p className="mt-2 max-w-[600px] text-[15px] leading-7 text-[#70798A]">
            Celebrate a teammate who made a
            difference. Choose someone, select a
            reason, and let them know you appreciate
            their work.
          </p>
        </div>

        {/* ===================================================
            MONTHLY KUDOS CARD
        =================================================== */}

        <section className="mb-8 overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-sm">

          <div className="p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    limitReached
                      ? "bg-[#FFF1F3] text-[#D45568]"
                      : "bg-[#F1EEFF] text-[#5B3CC4]"
                  }`}
                >
                  <Gift size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
                    Monthly allowance
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#18212F]">
                    {loadingMonthlyLimit
                      ? "Checking allowance..."
                      : limitReached
                      ? "Monthly limit reached"
                      : "Your Kudos allowance"}
                  </h2>
                </div>

              </div>

              <div className="sm:text-right">

                <p className="text-2xl font-bold text-[#18212F]">

                  {loadingMonthlyLimit
                    ? "—"
                    : usedThisMonth}

                  <span className="mx-1 text-[#B0B5BF]">
                    /
                  </span>

                  {monthlyLimit}

                </p>

                <p className="text-xs text-[#8A92A2]">
                  Kudos used this month
                </p>

              </div>

            </div>

            {/* Progress */}

            <div className="mt-5">

              <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F4]">

                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    limitReached
                      ? "bg-[#D45568]"
                      : "bg-[#5B3CC4]"
                  }`}
                  style={{
                    width: `${
                      loadingMonthlyLimit
                        ? 0
                        : usagePercentage
                    }%`,
                  }}
                />

              </div>

              <div className="mt-2 flex items-center justify-between">

                <p className="text-xs text-[#8A92A2]">

                  {loadingMonthlyLimit
                    ? "Checking..."
                    : remainingThisMonth >
                      0
                    ? `${remainingThisMonth} Kudos remaining`
                    : "No Kudos remaining this month"}

                </p>

                <p className="text-xs font-semibold text-[#8A92A2]">

                  {loadingMonthlyLimit
                    ? "—"
                    : `${Math.round(
                        usagePercentage
                      )}%`}

                </p>

              </div>

            </div>

          </div>

          {/* Limit message */}

          {limitReached && (
            <div className="border-t border-[#F1E4E7] bg-[#FFF8F9] px-6 py-4">

              <p className="text-sm font-semibold text-[#B94B5D]">
                You have used all{" "}
                {monthlyLimit} Kudos
                for this month.
              </p>

              <p className="mt-1 text-xs text-[#8A6670]">
                You can give more Kudos when
                the new month begins.
              </p>

            </div>
          )}

        </section>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* ===================================================
            EMPLOYEE
        =================================================== */}

        <section
          className={`mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm ${
            limitReached
              ? "opacity-75"
              : ""
          }`}
        >

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
              Step 1
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#18212F]">
              Who do you want to recognize?
            </h2>

          </div>

          {/* Search */}

          <div className="relative mb-5">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4ABB6]"
            />

            <input
              type="text"
              value={employeeSearch}
              onChange={(event) =>
                setEmployeeSearch(
                  event.target.value
                )
              }
              placeholder="Search employee..."
              disabled={
                limitReached ||
                loadingMonthlyLimit
              }
              className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:bg-[#F7F8FC]"
            />

          </div>

          {/* Employees */}

          {loadingEmployees ? (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[78px] animate-pulse rounded-xl bg-[#F1F2F5]"
                  />
                )
              )}

            </div>

          ) : filteredEmployees.length ===
            0 ? (

            <div className="rounded-xl border border-dashed border-[#DDE1E8] px-5 py-10 text-center">

              <p className="text-sm font-semibold text-[#70798A]">
                No employees found
              </p>

              <p className="mt-1 text-xs text-[#A0A7B4]">
                Try searching with another
                name or employee ID.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {filteredEmployees.map(
                (employee) => {

                  const isSelected =
                    selectedEmployee?.id ===
                    employee.id;

                  return (
                    <button
                      key={employee.id}
                      type="button"
                      disabled={
                        limitReached ||
                        loadingMonthlyLimit
                      }
                      onClick={() =>
                        handleSelectEmployee(
                          employee
                        )
                      }
                      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#5B3CC4] bg-[#F8F6FF] ring-2 ring-[#EEE9FF]"
                          : "border-[#E8EAF0] bg-white hover:border-[#CFC7F2] hover:bg-[#FBFAFF]"
                      } ${
                        limitReached
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                    >

                      {/* Avatar */}

                      {employee.profileImage ? (

                        <img
                          src={
                            employee.profileImage
                          }
                          alt={
                            employee.name
                          }
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                        />

                      ) : (

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FF] text-sm font-bold text-[#5B3CC4]">
                          {getInitials(
                            employee.name
                          )}
                        </div>

                      )}

                      {/* Details */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-bold text-[#18212F]">
                          {employee.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#70798A]">
                          {employee.designation ||
                            employee.employeeId}
                        </p>

                      </div>

                      {/* Selected */}

                      {isSelected ? (

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5B3CC4] text-white">
                          <Check size={15} />
                        </div>

                      ) : (

                        <ChevronRight
                          size={17}
                          className="shrink-0 text-[#A4ABB6]"
                        />

                      )}

                    </button>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <section
          className={`mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm ${
            limitReached
              ? "opacity-75"
              : ""
          }`}
        >

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
              Step 2
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#18212F]">
              What are you recognizing them
              for?
            </h2>

          </div>

          {loadingCategories ? (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[105px] animate-pulse rounded-xl bg-[#F1F2F5]"
                  />
                )
              )}

            </div>

          ) : categories.length === 0 ? (

            <div className="rounded-xl border border-dashed border-[#DDE1E8] px-5 py-10 text-center">

              <p className="text-sm font-semibold text-[#70798A]">
                No Kudos categories available.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {categories.map(
                (category) => {

                  const isSelected =
                    selectedCategory?.id ===
                    category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      disabled={
                        limitReached ||
                        loadingMonthlyLimit
                      }
                      onClick={() =>
                        handleSelectCategory(
                          category
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#5B3CC4] bg-[#F8F6FF] ring-2 ring-[#EEE9FF]"
                          : "border-[#E8EAF0] bg-white hover:border-[#CFC7F2] hover:bg-[#FBFAFF]"
                      } ${
                        limitReached
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EEFF] text-xl">
                          {category.icon}
                        </div>

                        {isSelected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3CC4] text-white">
                            <Check size={14} />
                          </div>
                        )}

                      </div>

                      <p className="mt-4 text-sm font-bold text-[#18212F]">
                        {category.name}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#70798A]">
                        {category.description}
                      </p>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        <section
          className={`mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm ${
            limitReached
              ? "opacity-75"
              : ""
          }`}
        >

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
              Step 3
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#18212F]">
              Write your message
            </h2>

          </div>

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            placeholder="Tell them why you appreciate their work..."
            rows={6}
            maxLength={500}
            disabled={
              limitReached ||
              loadingMonthlyLimit
            }
            className="w-full resize-none rounded-xl border border-[#E2E5EB] bg-white px-4 py-4 text-sm leading-6 text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:bg-[#F7F8FC]"
          />

          <div className="mt-2 flex justify-end">

            <p className="text-xs text-[#A0A7B4]">
              {message.length}/500
            </p>

          </div>

        </section>

        {/* ===================================================
            ACTION
        =================================================== */}

        <div className="flex justify-end">

          <button
            type="button"
            onClick={handlePreview}
            disabled={
              loadingEmployees ||
              loadingCategories ||
              loadingMonthlyLimit ||
              employees.length === 0 ||
              categories.length === 0 ||
              limitReached
            }
            className={`inline-flex items-center gap-3 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,60,196,0.22)] transition ${
              limitReached
                ? "cursor-not-allowed bg-[#A9A4B8] shadow-none"
                : "bg-[#5B3CC4] hover:-translate-y-0.5 hover:bg-[#4D32AD]"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >

            {limitReached
              ? "Monthly Limit Reached"
              : "Preview Kudos"}

            {!limitReached && (
              <ChevronRight size={17} />
            )}

          </button>

        </div>

        {/* ===================================================
            LIMIT NOTE
        =================================================== */}

        {limitReached && (
          <div className="mt-4 text-center">

            <p className="text-xs font-medium text-[#8A92A2]">
              You have used all{" "}
              {monthlyLimit} Kudos
              available for this month.
            </p>

          </div>
        )}

      </div>

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      {showPreview && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18212F]/50 px-5 py-8 backdrop-blur-sm">

          <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="border-b border-[#E8EAF0] px-6 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
                    Preview
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#18212F]">
                    Your Kudos
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!sending) {
                      setShowPreview(
                        false
                      );
                    }
                  }}
                  disabled={sending}
                  className="text-sm font-semibold text-[#70798A] hover:text-[#18212F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close
                </button>

              </div>

            </div>

            {/* Modal Body */}

            <div className="px-6 py-6">

              {/* Receiver */}

              <div className="flex items-center gap-4">

                {selectedEmployee?.profileImage ? (

                  <img
                    src={
                      selectedEmployee.profileImage
                    }
                    alt={
                      selectedEmployee.name
                    }
                    className="h-14 w-14 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEE9FF] text-base font-bold text-[#5B3CC4]">
                    {getInitials(
                      selectedEmployee?.name
                    )}
                  </div>

                )}

                <div>

                  <p className="text-sm font-bold text-[#18212F]">
                    {selectedEmployee?.name}
                  </p>

                  <p className="mt-0.5 text-xs text-[#70798A]">
                    {selectedEmployee?.designation ||
                      selectedEmployee?.employeeId}
                  </p>

                </div>

              </div>

              {/* Category */}

              <div className="mt-6 rounded-xl bg-[#F8F6FF] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg">
                    {selectedCategory?.icon}
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-[#9BA3B0]">
                      Recognized for
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-[#5B3CC4]">
                      {selectedCategory?.name}
                    </p>

                  </div>

                </div>

              </div>

              {/* Message */}

              <div className="mt-6">

                <p className="mb-2 text-xs font-semibold text-[#9BA3B0]">
                  Message
                </p>

                <p className="rounded-xl bg-[#F7F8FC] px-4 py-4 text-sm leading-6 text-[#18212F]">
                  {message}
                </p>

              </div>

              <p className="mt-5 text-center text-xs text-[#A0A7B4]">

                You have{" "}

                <span className="font-semibold text-[#5B3CC4]">
                  {Math.max(
                    0,
                    remainingThisMonth - 1
                  )}
                </span>{" "}

                Kudos remaining after this
                submission.

              </p>

            </div>

            {/* Modal Footer */}

            <div className="flex gap-3 border-t border-[#E8EAF0] px-6 py-5">

              <button
                type="button"
                onClick={() => {
                  if (!sending) {
                    setShowPreview(false);
                  }
                }}
                disabled={sending}
                className="flex-1 rounded-xl border border-[#E2E5EB] px-5 py-3 text-sm font-bold text-[#70798A] transition hover:bg-[#F7F8FC] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleSendKudos}
                disabled={
                  sending ||
                  limitReached ||
                  loadingMonthlyLimit
                }
                className="flex-1 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {sending
                  ? "Sending..."
                  : "Send Kudos"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}