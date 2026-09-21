"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!employeeId.trim()) {
      setError("Please enter your employee ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error("Unexpected login response:", text);

        throw new Error(
          "The server returned an unexpected response. Please try again."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Invalid employee ID or password."
        );
      }

      console.log("Login successful:", result.user);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-5">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src="/logo.jpg"
            alt="Kudos Card"
            className="mx-auto mb-5 h-20 w-20 rounded-2xl object-contain"
          />

          <h1 className="text-3xl font-bold text-[#18212F]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#70798A]">
            Sign in to your Kudos Card account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#E8EAF0] bg-white p-7 shadow-sm">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Employee ID */}
            <div className="mb-5">
              <label
                htmlFor="employeeId"
                className="mb-2 block text-sm font-semibold text-[#18212F]"
              >
                Employee ID
              </label>

              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(event) =>
                  setEmployeeId(event.target.value)
                }
                placeholder="Enter employee ID"
                autoComplete="username"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white px-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#18212F]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white px-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#5B3CC4] text-sm font-bold text-white transition hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#A0A7B4]">
          Kudos Card · Celebrate people
        </p>

      </div>
    </main>
  );
}