"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopNavbar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);

  // Generate user initials
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(user?.name);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Logout failed");
      }

      setProfileOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      setLoggingOut(false);
    }
  }

  // Navigation items
  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
    },
    {
      label: "Give Kudos",
      href: "/give-kudos",
    },
    {
      label: "Kudos Wall",
      href: "/kudos-wall",
    },
    {
      label: "My Kudos",
      href: "/my-kudos",
    },
  ];

  // Check active route
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname?.startsWith(`${href}/`)
    );
  };

  return (
    <header className="border-b border-[#E8EAF0] bg-white">
      <div className="mx-auto flex h-[100px] max-w-[1280px] items-center justify-between px-6 lg:px-8">

        {/* ================================
            LOGO
        ================================= */}

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <img
            src="/logo.jpg"
            alt="Kudos Card"
            className="h-22 w-22 object-contain"
          />

          <div>
            <p
              className="text-[18px] font-bold tracking-[-0.02em] text-[#18212F]"
              style={{
                marginRight: "10px",
              }}
            >
              Kudos Card
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A92A2]">
              Celebrate people
            </p>
          </div>
        </Link>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2.5 text-sm transition ${
                  active
                    ? "bg-[#F1EEFF] font-semibold text-[#5B3CC4]"
                    : "font-medium text-[#596273] hover:bg-[#F7F8FC] hover:text-[#18212F]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="flex items-center gap-4">

          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8EAF0] bg-white text-[#596273] transition hover:bg-[#F7F8FC]"
          >
            <Bell size={18} />

            <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#E85D75]" />
          </button>

          {/* ================================
              USER PROFILE
          ================================= */}

          <div
            ref={profileRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#F7F8FC]"
            >

              {/* Profile Image */}

              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E1FF] text-sm font-bold text-[#5B3CC4]">
                  {initials}
                </div>
              )}

              {/* User Information */}

              <div className="text-left">
                <p className="max-w-[120px] truncate text-sm font-semibold text-[#18212F]">
                  {user?.name || "User"}
                </p>

                <p className="max-w-[120px] truncate text-[11px] text-[#8A92A2]">
                  {user?.designation || "Employee"}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`text-[#8A92A2] transition-transform ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ================================
                PROFILE DROPDOWN
            ================================= */}

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[240px] overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_12px_40px_rgba(24,33,47,0.12)]">

                {/* User Details */}

                <div className="border-b border-[#EEF0F4] px-4 py-4">

                  <div className="flex items-center gap-3">

                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E1FF] text-sm font-bold text-[#5B3CC4]">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#18212F]">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-[#8A92A2]">
                        {user?.email || ""}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Dropdown Items */}

                <div className="p-2">

                  {/* Profile */}

                  <Link
                    href="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#596273] transition hover:bg-[#F7F8FC] hover:text-[#18212F]"
                  >
                    <User
                      size={17}
                      className="text-[#7B8493]"
                    />

                    <span>
                      My Profile
                    </span>
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#D45568] transition hover:bg-[#FFF3F5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut size={17} />

                    <span>
                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </span>
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}