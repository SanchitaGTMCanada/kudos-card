"use client";

import Link from "next/link";
import { Bell, ChevronDown, Sparkles } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="border-b border-[#E8EAF0] bg-white">
      <div className="mx-auto flex h-[100px] max-w-[1280px] items-center justify-between px-6 lg:px-8">

        {/* Logo */}
       <Link href="/" className="flex items-center gap-3">
  <img
    src="/logo.jpg"
    alt="Kudos Card"
    className="h-22 w-22 object-contain"
  />

  <div>
    <p className="text-[18px] font-bold tracking-[-0.02em] text-[#18212F]" style={{marginRight:"10px"}}>
      Kudos Card
    </p>

    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A92A2]">
      Celebrate people
    </p>
  </div>
</Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#F1EEFF] px-4 py-2.5 text-sm font-semibold text-[#5B3CC4]"
          >
            Home
          </Link>

          <Link
            href="/give-kudos"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#596273] transition hover:bg-[#F7F8FC] hover:text-[#18212F]"
          >
            Give Kudos
          </Link>

          <Link
            href="/kudos-wall"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#596273] transition hover:bg-[#F7F8FC] hover:text-[#18212F]"
          >
            Kudos Wall
          </Link>

          <Link
            href="/my-kudos"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#596273] transition hover:bg-[#F7F8FC] hover:text-[#18212F]"
          >
            My Kudos
          </Link>
        </nav>

        {/* User */}
        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8EAF0] bg-white text-[#596273] transition hover:bg-[#F7F8FC]">
            <Bell size={18} />

            <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#E85D75]" />
          </button>

          <button className="hidden items-center gap-2 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E1FF] text-sm font-bold text-[#5B3CC4]">
              SS
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-[#18212F]">
                Sanchita
              </p>

              <p className="text-[11px] text-[#8A92A2]">
                Employee
              </p>
            </div>

            <ChevronDown size={15} className="text-[#8A92A2]" />
          </button>
        </div>

      </div>
    </header>
  );
}