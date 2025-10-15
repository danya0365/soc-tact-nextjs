import { CommunityView } from "@/src/presentation/components/community/CommunityView";
import { CommunityPresenterFactory } from "@/src/presentation/presenters/community/CommunityPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await CommunityPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "Community Hub | Soccer Tactics - ชุมชนคอมมูนิตี้ฟุตบอล",
      description: "Join our football community and connect with fans worldwide. Discuss tactics, share opinions, and engage with fellow football enthusiasts.",
    };
  }
}

/**
 * Community Hub page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CommunityPage() {
  const presenter = await CommunityPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <CommunityView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching community data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ไม่สามารถโหลดข้อมูลชุมชนได้ กรุณาลองใหม่อีกครั้ง
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              กลับหน้าแรก
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl border border-gray-300 dark:border-gray-700"
            >
              รีเฟรช
            </button>
          </div>
        </div>
      </div>
    );
  }
}
