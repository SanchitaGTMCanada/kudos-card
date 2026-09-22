"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
  BriefcaseBusiness,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (
      !form.employeeId ||
      !form.name ||
      !form.email ||
      !form.designation ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create account."
        );
      }

      // Signup automatically creates the session.
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="flex min-h-screen">

        {/* LEFT SIDE */}

        <section className="relative hidden overflow-hidden bg-[#5B3CC4] lg:flex lg:w-[45%]">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#BBA7FF]/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <Link
              href="/login"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src="/logo.jpg"
                  alt="Kudos Card"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  Kudos Card
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                  Celebrate people
                </p>
              </div>
            </Link>

            <div className="max-w-[480px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                <Sparkles size={14} />
                Employee Recognition
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
                Celebrate great people.
                <br />
                Make appreciation count.
              </h1>

              <p className="mt-6 max-w-[430px] text-[15px] leading-7 text-white/70">
                Create your Kudos Card account and start
                recognizing the people who make a difference
                every day.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Recognize your teammates",
                  "React to meaningful achievements",
                  "Build a culture of appreciation",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/85"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <Sparkles size={13} />
                    </div>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Kudos Card
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}

        <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[55%] lg:px-12">
          <div className="w-full max-w-[520px]">

            {/* Mobile logo */}

            <div className="mb-8 flex items-center lg:hidden">
              <Link
                href="/login"
                className="flex items-center gap-3"
              >
                <img
                  src="/logo.jpg"
                  alt="Kudos Card"
                  className="h-12 w-12 rounded-xl object-contain"
                />

                <div>
                  <p className="text-lg font-bold text-[#18212F]">
                    Kudos Card
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A92A2]">
                    Celebrate people
                  </p>
                </div>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B3CC4]">
                Create account
              </p>

              <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#18212F]">
                Join Kudos Card
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#70798A]">
                Create your employee account to start giving
                and receiving appreciation.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-[#FFD9DF] bg-[#FFF3F5] px-4 py-3 text-sm font-medium text-[#D45568]">
                {error}
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
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Employee ID
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    value={form.employeeId}
                    onChange={handleChange}
                    placeholder="EMP003"
                    autoComplete="username"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />
                </div>
              </div>

              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />
                </div>
              </div>

              {/* Designation */}

              <div>
                <label
                  htmlFor="designation"
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Designation
                </label>

                <div className="relative">
                  <BriefcaseBusiness
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-12 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A92A2] hover:bg-[#F7F8FC] hover:text-[#5B3CC4]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#303A48]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-[#E1E4EA] bg-white pl-11 pr-12 text-sm text-[#18212F] outline-none transition placeholder:text-[#B0B6C0] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#5B3CC4]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A92A2] hover:bg-[#F7F8FC] hover:text-[#5B3CC4]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B3CC4] text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,60,196,0.20)] transition hover:-translate-y-0.5 hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Login */}

            <p className="mt-7 text-center text-sm text-[#70798A]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#5B3CC4] hover:text-[#4D32AD]"
              >
                Sign in
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}