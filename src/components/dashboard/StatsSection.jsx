import { Heart, Send, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Kudos Given",
    value: "18",
    icon: Send,
    iconBg: "bg-[#EEF4FF]",
    iconColor: "text-[#2F6FED]",
  },
  {
    label: "Kudos Received",
    value: "27",
    icon: Heart,
    iconBg: "bg-[#FFF0F3]",
    iconColor: "text-[#E85D75]",
  },
  {
    label: "This Month",
    value: "12",
    icon: Sparkles,
    iconBg: "bg-[#F2EEFF]",
    iconColor: "text-[#7257C7]",
  },
];

export default function StatsSection() {
  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-[#E8EAF0] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon size={19} className={item.iconColor} />
              </div>

              <span className="text-[12px] font-medium text-[#A0A7B4]">
                2026
              </span>
            </div>

            <p className="mt-5 text-[30px] font-bold tracking-[-0.04em] text-[#18212F]">
              {item.value}
            </p>

            <p className="mt-1 text-sm text-[#70798A]">
              {item.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}