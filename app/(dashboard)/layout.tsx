import MobileNav from "@/components/Navigation/MobileNav";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      {/* Main content */}
      <main className="md:pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
