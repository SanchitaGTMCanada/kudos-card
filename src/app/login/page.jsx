
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Unexpected login response:",
          text
        );

        throw new Error(
          "The server returned an unexpected response. Please try again."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Invalid employee ID or password."
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
    <main className="min-h-screen bg-[#F7F8FC]">

      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT BRANDING PANEL
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#5B3CC4] lg:flex lg:w-[48%]">

          {/* Decorative background */}

          <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-[560px] w-[560px] rounded-full bg-[#BBA7FF]/20 blur-3xl" />

          <div className="absolute right-[15%] top-[25%] h-32 w-32 rounded-full bg-white/5 blur-2xl" />

          {/* Content */}

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <Link
              href="/login"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="Kudos Card"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-[18px] font-bold tracking-[-0.02em] text-white">
                  Kudos Card
                </p>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                  Celebrate people
                </p>
              </div>
            </Link>

            {/* Main Message */}

            <div className="max-w-[500px]">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                <Sparkles size={14} />
                Employee Recognition
              </div>

              <h1 className="text-[42px] font-bold leading-[1.08] tracking-[-0.045em] text-white xl:text-[54px]">
                Appreciation
                <br />
                makes teams
                <br />
                stronger.
              </h1>

              <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-white/65">
                Recognize the people who make a difference.
                Give Kudos, celebrate achievements and build
                a culture where great work gets noticed.
              </p>

              {/* Features */}

              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Sparkles size={14} />
                  </div>

                  Celebrate great work
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <ShieldCheck size={14} />
                  </div>

                  Recognize your teammates
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight size={14} />
                  </div>

                  Build a culture of appreciation
                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-between">
              <p className="text-xs text-white/35">
                © {new Date().getFullYear()} Kudos Card
              </p>

              <p className="text-xs text-white/35">
                Employee Recognition Platform
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            LOGIN PANEL
        ====================================================== */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[52%] lg:px-12">

          <div className="w-full max-w-[460px]">

            {/* Mobile Logo */}

            <div className="mb-10 flex items-center lg:hidden">

              <Link
                href="/login"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                  <img
                    src="/logo.jpg"
                    alt="Kudos Card"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-[17px] font-bold text-[#18212F]">
                    Kudos Card
                  </p>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A92A2]">
                    Celebrate people
                  </p>
                </div>
              </Link>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B3CC4]">
                Welcome back
              </p>

              <h2 className="text-[34px] font-bold tracking-[-0.045em] text-[#18212F]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-[14px] leading-6 text-[#70798A]">
                Enter your employee credentials to continue
                to your Kudos Card dashboard.
              </p>

            </div>

            {/* Login Card */}

            <div className="rounded-[24px] border border-[#E8EAF0] bg-white p-6 shadow-[0_20px_60px_rgba(24,33,47,0.06)] sm:p-8">

              {/* Error */}

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FFD9DF] bg-[#FFF4F6] px-4 py-3.5">

                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E85D75] text-[11px] font-bold text-white">
                    !
                  </div>

                  <p className="text-sm leading-5 text-[#D45568]">
                    {error}
                  </p>

                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Employee ID */}

                <div>

                  <label
                    htmlFor="employeeId"
                    className="mb-2 block text-[13px] font-bold text-[#303A48]"
                  >
                    Employee ID
                  </label>

                  <div className="group relative">

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0] transition group-focus-within:text-[#5B3CC4]">
                      <Mail size={18} />
                    </div>

                    <input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(event) => {
                        setEmployeeId(event.target.value);
                        setError("");
                      }}
                      placeholder="e.g. EMP001"
                      autoComplete="username"
                      disabled={loading}
                      className="h-[52px] w-full rounded-xl border border-[#E1E4EA] bg-[#FCFCFD] pl-11 pr-4 text-sm font-medium text-[#18212F] outline-none transition placeholder:text-[#AAB1BC] hover:border-[#D4D8E0] focus:border-[#5B3CC4] focus:bg-white focus:ring-4 focus:ring-[#5B3CC4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-[13px] font-bold text-[#303A48]"
                    >
                      Password
                    </label>

                  </div>

                  <div className="group relative">

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0] transition group-focus-within:text-[#5B3CC4]">
                      <LockKeyhole size={18} />
                    </div>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-[52px] w-full rounded-xl border border-[#E1E4EA] bg-[#FCFCFD] pl-11 pr-12 text-sm font-medium text-[#18212F] outline-none transition placeholder:text-[#AAB1BC] hover:border-[#D4D8E0] focus:border-[#5B3CC4] focus:bg-white focus:ring-4 focus:ring-[#5B3CC4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#8A92A2] transition hover:bg-[#F1EEFF] hover:text-[#5B3CC4] disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#5B3CC4] text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,60,196,0.20)] transition hover:-translate-y-0.5 hover:bg-[#4D32AD] hover:shadow-[0_16px_35px_rgba(91,60,196,0.25)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* Signup */}

              <div className="mt-7 border-t border-[#EEF0F4] pt-6 text-center">

                <p className="text-sm text-[#70798A]">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-[#5B3CC4] transition hover:text-[#4D32AD]"
                  >
                    Create an account
                  </Link>
                </p>

              </div>

            </div>

            {/* Bottom text */}

            <p className="mt-6 text-center text-[11px] font-medium text-[#A0A7B4]">
              Secure employee access · Kudos Card
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

