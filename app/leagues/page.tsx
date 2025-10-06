import { LeaguesView } from "@/src/presentation/components/leagues/LeaguesView";
import { LeaguesPresenterFactory } from "@/src/presentation/presenters/leagues/LeaguesPresenter";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Generate metadata for the leagues page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = LeaguesPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตารางคะแนนลีก | Soccer Tactics",
      description: "ดูตารางคะแนนจากลีกชั้นนำทั่วโลก",
    };
  }
}

/**
 * Leagues Page - Server Component for SEO optimization
 */
export default async function LeaguesPage() {
  const presenter = LeaguesPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <LeaguesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching leagues data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดข้อมูลลีกได้
          </p>
          <Link
            href="/"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }
}
