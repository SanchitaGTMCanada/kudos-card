import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function WelcomeSection() {
  return (
    <section className="mb-8 overflow-hidden rounded-[28px] border border-[#E8EAF0] bg-white">
      <div className="relative px-7 py-8 sm:px-10 sm:py-10">

        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#EDE7FF] blur-3xl" />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
              <Sparkles size={13} />
              Employee Recognition
            </div>

            <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#18212F] sm:text-[40px]">
              Good morning, Sanchita 👋
            </h1>

            <p className="mt-3 max-w-[540px] text-[15px] leading-7 text-[#70798A]">
              Recognize someone who made a difference today.
              A little appreciation can make a big impact.
            </p>
          </div>

          <Link
            href="/give-kudos"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#5B3CC4] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,60,196,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4D32AD]"
          >
            <Sparkles size={17} />

            Give Kudos

            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

        </div>
      </div>
    </section>
  );
}