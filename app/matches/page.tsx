import { MatchesView } from "@/src/presentation/components/matches/MatchesView";
import { MatchesPresenterFactory } from "@/src/presentation/presenters/matches/MatchesPresenter";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Generate metadata for the matches page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = MatchesPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ผลบอลสด - Match Center | Soccer Tactics",
      description: "ติดตามผลบอลสดและตารางแข่งขันจากลีกชั้นนำทั่วโลก",
    };
  }
}

/**
 * Matches Page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function MatchesPage() {
  const presenter = MatchesPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <MatchesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching matches data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดข้อมูลการแข่งขันได้
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
