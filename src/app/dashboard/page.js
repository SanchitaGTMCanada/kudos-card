import { redirect } from "next/navigation";

import TopNavbar from "@/components/layout/TopNavbar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import RecentKudos from "@/components/dashboard/RecentKudos";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNavbar user={user} />

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
        <WelcomeSection user={user} />

        <StatsSection />

        <RecentKudos user={user} />
      </main>
    </div>
  );
}