import { Outlet } from "react-router-dom";
import { HorizontalNav } from "@/components/navigation/HorizontalNav";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <HorizontalNav />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
