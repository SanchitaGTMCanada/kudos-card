"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";

export default function GiveKudosPage() {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");

  const [employeeSearch, setEmployeeSearch] = useState("");

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  /*
   * Load employees
   */
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
            result.message || "Failed to load employees"
          );
        }

        setEmployees(result.employees || []);
      } catch (error) {
        console.error("Load employees error:", error);

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

  /*
   * Load categories
   */
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
            result.message || "Failed to load categories"
          );
        }

        setCategories(result.categories || []);
      } catch (error) {
        console.error("Load categories error:", error);

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

  /*
   * Filter employees
   */
  const filteredEmployees = useMemo(() => {
    const search = employeeSearch.trim().toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name?.toLowerCase().includes(search) ||
        employee.employeeId?.toLowerCase().includes(search) ||
        employee.designation?.toLowerCase().includes(search)
      );
    });
  }, [employees, employeeSearch]);

  /*
   * Get employee initials
   */
  function getInitials(name) {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  /*
   * Select employee
   */
  function handleSelectEmployee(employee) {
    setSelectedEmployee(employee);
    setError("");
  }

  /*
   * Select category
   */
  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setError("");
  }

  /*
   * Open preview
   */
  function handlePreview() {
    setError("");

    if (!selectedEmployee) {
      setError("Please select an employee.");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a Kudos category.");
      return;
    }

    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Please write a little more in your message.");
      return;
    }

    setShowPreview(true);
  }

  /*
   * Send Kudos
   */
  async function handleSendKudos() {
    setError("");

    if (!selectedEmployee) {
      setError("Please select an employee.");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a Kudos category.");
      return;
    }

    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Please write a little more in your message.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/kudos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedEmployee.id,
          categoryId: selectedCategory.id,
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to send Kudos"
        );
      }

      setShowPreview(false);

      /*
       * Redirect after successful submission.
       *
       * The dashboard API will now load the newly
       * created Kudos from the database.
       */
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Send Kudos error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send Kudos"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
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

      {/* Main */}
      <div className="mx-auto max-w-[1000px] px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
            <Sparkles size={13} />
            Employee Recognition
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F]">
            Give Kudos
          </h1>

          <p className="mt-2 max-w-[600px] text-[15px] leading-7 text-[#70798A]">
            Celebrate a teammate who made a difference.
            Choose someone, select a reason, and let them know
            you appreciate their work.
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

        {/* Employee */}
        <section className="mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm">
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
                setEmployeeSearch(event.target.value)
              }
              placeholder="Search employee..."
              className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF]"
            />
          </div>

          {/* Employees */}
          {loadingEmployees ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[78px] animate-pulse rounded-xl bg-[#F1F2F5]"
                />
              ))}
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DDE1E8] px-5 py-10 text-center">
              <p className="text-sm font-semibold text-[#70798A]">
                No employees found
              </p>

              <p className="mt-1 text-xs text-[#A0A7B4]">
                Try searching with another name or employee ID.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredEmployees.map((employee) => {
                const isSelected =
                  selectedEmployee?.id === employee.id;

                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() =>
                      handleSelectEmployee(employee)
                    }
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#5B3CC4] bg-[#F8F6FF] ring-2 ring-[#EEE9FF]"
                        : "border-[#E8EAF0] bg-white hover:border-[#CFC7F2] hover:bg-[#FBFAFF]"
                    }`}
                  >
                    {/* Avatar */}
                    {employee.profileImage ? (
                      <img
                        src={employee.profileImage}
                        alt={employee.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FF] text-sm font-bold text-[#5B3CC4]">
                        {getInitials(employee.name)}
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
              })}
            </div>
          )}
        </section>

        {/* Category */}
        <section className="mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BA3B0]">
              Step 2
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#18212F]">
              What are you recognizing them for?
            </h2>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-[105px] animate-pulse rounded-xl bg-[#F1F2F5]"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DDE1E8] px-5 py-10 text-center">
              <p className="text-sm font-semibold text-[#70798A]">
                No Kudos categories available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isSelected =
                  selectedCategory?.id === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleSelectCategory(category)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#5B3CC4] bg-[#F8F6FF] ring-2 ring-[#EEE9FF]"
                        : "border-[#E8EAF0] bg-white hover:border-[#CFC7F2] hover:bg-[#FBFAFF]"
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
              })}
            </div>
          )}
        </section>

        {/* Message */}
        <section className="mb-8 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-sm">
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
              setMessage(event.target.value)
            }
            placeholder="Tell them why you appreciate their work..."
            rows={6}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-[#E2E5EB] bg-white px-4 py-4 text-sm leading-6 text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF]"
          />

          <div className="mt-2 flex justify-end">
            <p className="text-xs text-[#A0A7B4]">
              {message.length}/500
            </p>
          </div>
        </section>

        {/* Action */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePreview}
            disabled={
              loadingEmployees ||
              loadingCategories ||
              employees.length === 0 ||
              categories.length === 0
            }
            className="inline-flex items-center gap-3 rounded-xl bg-[#5B3CC4] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,60,196,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Preview Kudos
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {/* Preview Modal */}
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
                      setShowPreview(false);
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
                    src={selectedEmployee.profileImage}
                    alt={selectedEmployee.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEE9FF] text-base font-bold text-[#5B3CC4]">
                    {getInitials(selectedEmployee?.name)}
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
                From you
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
                disabled={sending}
                className="flex-1 rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Kudos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}