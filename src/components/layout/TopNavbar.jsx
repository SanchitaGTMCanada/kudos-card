"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  Flame,
  Heart,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopNavbar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // ================================
  // User initials
  // ================================

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

  // ================================
  // Navigation
  // ================================

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

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname?.startsWith(`${href}/`)
    );
  };

  // ================================
  // Load notifications
  // ================================

  async function loadNotifications() {
    try {
      setNotificationsLoading(true);

      const response = await fetch("/api/notifications", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load notifications"
        );
      }

      setNotifications(result.notifications || []);
      setUnreadCount(result.unreadCount || 0);
    } catch (error) {
      console.error(
        "Load notifications error:",
        error
      );
    } finally {
      setNotificationsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  // ================================
  // Close dropdowns on outside click
  // ================================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================================
  // Notification time
  // ================================

  function formatNotificationTime(date) {
    const createdAt = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - createdAt.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  // ================================
  // Mark notification as read
  // ================================

  async function markNotificationAsRead(
    notificationId
  ) {
    try {
      const response = await fetch(
        "/api/notifications/read",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to mark notification as read"
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(current - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  }

  // ================================
  // Mark all notifications as read
  // ================================

  async function markAllAsRead() {
    const unreadNotifications =
      notifications.filter(
        (notification) => !notification.isRead
      );

    if (!unreadNotifications.length) {
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch("/api/notifications/read", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notificationId: notification.id,
            }),
          })
        )
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      loadNotifications();
    }
  }

  // ================================
  // Notification click
  // ================================

  async function handleNotificationClick(
    notification
  ) {
    if (!notification.isRead) {
      await markNotificationAsRead(
        notification.id
      );
    }

    setNotificationOpen(false);

    if (notification.kudosId) {
      router.push("/kudos-wall");
    }
  }

  // ================================
  // Logout
  // ================================

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Logout failed"
        );
      }

      setProfileOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      setLoggingOut(false);
    }
  }

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

          {/* ================================
              NOTIFICATIONS
          ================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              onClick={() => {
                setNotificationOpen(
                  (prev) => !prev
                );
                setProfileOpen(false);

                if (!notificationOpen) {
                  loadNotifications();
                }
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8EAF0] bg-white text-[#596273] transition hover:bg-[#F7F8FC]"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#E85D75] px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* ================================
                NOTIFICATION DROPDOWN
            ================================= */}

            {notificationOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_16px_50px_rgba(24,33,47,0.14)]">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#EEF0F4] px-5 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#18212F]">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-[11px] text-[#9BA3B0]">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "You're all caught up"}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5B3CC4] transition hover:text-[#4D32AD]"
                    >
                      <Check size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}

                <div className="max-h-[420px] overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="space-y-3 p-4">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="animate-pulse rounded-xl bg-[#F7F8FC] p-4"
                        >
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#E9EBF0]" />

                            <div className="flex-1">
                              <div className="h-3 w-40 rounded bg-[#E9EBF0]" />

                              <div className="mt-2 h-3 w-full rounded bg-[#E9EBF0]" />

                              <div className="mt-2 h-2 w-20 rounded bg-[#E9EBF0]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EEFF]">
                        <Bell
                          size={21}
                          className="text-[#5B3CC4]"
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#18212F]">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#9BA3B0]">
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => {
                        const sender =
                          notification.kudos?.sender;

                        const category =
                          notification.kudos?.category;

                        return (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                            className={`flex w-full gap-3 border-b border-[#F1F2F5] px-5 py-4 text-left transition last:border-b-0 hover:bg-[#F9F8FD] ${
                              !notification.isRead
                                ? "bg-[#FCFAFF]"
                                : "bg-white"
                            }`}
                          >
                            {/* Avatar */}

                            <div className="shrink-0">
                              {sender?.profileImage ? (
                                <img
                                  src={
                                    sender.profileImage
                                  }
                                  alt={
                                    sender.name ||
                                    "User"
                                  }
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E1FF] text-xs font-bold text-[#5B3CC4]">
                                  {getInitials(
                                    sender?.name
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Content */}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold text-[#18212F]">
                                  {notification.title}
                                </p>

                                {!notification.isRead && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5B3CC4]" />
                                )}
                              </div>

                              <p className="mt-1 text-xs leading-5 text-[#70798A]">
                                {notification.message}
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                {category?.icon && (
                                  <span className="text-xs">
                                    {category.icon}
                                  </span>
                                )}

                                {category?.name && (
                                  <span className="text-[10px] font-semibold text-[#5B3CC4]">
                                    {category.name}
                                  </span>
                                )}

                                <span className="text-[10px] text-[#A4ABB6]">
                                  •
                                </span>

                                <span className="text-[10px] text-[#A4ABB6]">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )
                  )}
                </div>

                {/* Footer */}

                {notifications.length > 0 && (
                  <div className="border-t border-[#EEF0F4] px-5 py-3">
                    <Link
                      href="/kudos-wall"
                      onClick={() =>
                        setNotificationOpen(false)
                      }
                      className="block text-center text-xs font-bold text-[#5B3CC4] transition hover:text-[#4D32AD]"
                    >
                      View Kudos Wall
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================================
              USER PROFILE
          ================================= */}

          <div
            ref={profileRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() => {
                setProfileOpen(
                  (prev) => !prev
                );
                setNotificationOpen(false);
              }}
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
                        alt={
                          user.name || "User"
                        }
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