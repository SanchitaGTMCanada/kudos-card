import Link from "next/link";
import { ArrowRight, Flame, Heart, Sparkles, ThumbsUp } from "lucide-react";

const kudos = [
  {
    category: "Great Work",
    icon: Sparkles,
    iconBg: "bg-[#FFF7E5]",
    iconColor: "text-[#C9911A]",
    from: "Rahul Sharma",
    to: "Priya Das",
    message:
      "Amazing work on the client presentation. You really helped the team deliver it successfully!",
    time: "2 hours ago",
    reactions: {
      heart: 12,
      clap: 8,
      fire: 5,
    },
  },
  {
    category: "Going Extra Mile",
    icon: Flame,
    iconBg: "bg-[#FFF0EB]",
    iconColor: "text-[#E56A3D]",
    from: "Neha Sen",
    to: "Amit Roy",
    message:
      "Thank you for going above and beyond to help us resolve the issue before the deadline.",
    time: "5 hours ago",
    reactions: {
      heart: 9,
      clap: 5,
      fire: 7,
    },
  },
];

export default function RecentKudos() {
  return (
    <section>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A92A2]">
            Recognition
          </p>

          <h2 className="mt-1 text-[23px] font-bold tracking-[-0.03em] text-[#18212F]">
            Recent Kudos
          </h2>
        </div>

        <Link
          href="/kudos-wall"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3CC4] hover:text-[#4D32AD]"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="space-y-4">
        {kudos.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={`${item.from}-${item.to}`}
              className="rounded-[22px] border border-[#E8EAF0] bg-white p-6 transition hover:border-[#DCD6F5] hover:shadow-[0_12px_35px_rgba(31,35,55,0.06)]"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  <Icon size={21} className={item.iconColor} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7A8392]">
                      {item.category}
                    </span>

                    <span className="text-[11px] text-[#A0A7B4]">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#303A48]">
                    {item.from}
                    <span className="mx-2 font-normal text-[#B1B7C1]">
                      →
                    </span>
                    {item.to}
                  </p>

                  <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#687383]">
                    "{item.message}"
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <button className="flex items-center gap-1.5 rounded-full bg-[#FFF3F5] px-3 py-1.5 text-xs font-semibold text-[#D95169]">
                      <Heart size={13} />
                      {item.reactions.heart}
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full bg-[#EEF4FF] px-3 py-1.5 text-xs font-semibold text-[#3C6FC5]">
                      <ThumbsUp size={13} />
                      {item.reactions.clap}
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full bg-[#FFF4EA] px-3 py-1.5 text-xs font-semibold text-[#D76C2C]">
                      <Flame size={13} />
                      {item.reactions.fire}
                    </button>
                  </div>

                </div>
              </div>
            </article>
          );
        })}
      </div>

    </section>
  );
}