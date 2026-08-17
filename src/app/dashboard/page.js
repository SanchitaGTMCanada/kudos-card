import TopNavbar from "@/components/layout/TopNavbar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import RecentKudos from "@/components/dashboard/RecentKudos";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNavbar />

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
        <WelcomeSection />
        <StatsSection />
        <RecentKudos />
      </main>
    </div>
  );
}