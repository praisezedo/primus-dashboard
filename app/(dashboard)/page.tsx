import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Footer from "@/components/UI/Footer";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";

export default async function Page() {
  try {
    await verifyAuth();
  } catch (error) {
    redirect("/signup");
  }

  return (
    <>
      <DashboardStats />

      <div className="px-4 lg:px-6 mt-4 lg:mt-6">
        <DashboardCharts />
      </div>

      <Footer />
    </>
  );
}