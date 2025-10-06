import { LeagueDetailView } from "@/src/presentation/components/leagues/LeagueDetailView";
import { LeagueDetailPresenterFactory } from "@/src/presentation/presenters/leagues/LeagueDetailPresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface LeagueDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the league detail page
 */
export async function generateMetadata({
  params,
}: LeagueDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = LeagueDetailPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(resolvedParams.id);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตารางคะแนนลีก | Soccer Tactics",
      description: "ดูตารางคะแนนและสถิติลีก",
    };
  }
}

/**
 * League Detail Page - Server Component for SEO optimization
 */
export default async function LeagueDetailPage({
  params,
}: LeagueDetailPageProps) {
  const resolvedParams = await params;
  const presenter = LeagueDetailPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(resolvedParams.id);

    return (
      <LeagueDetailView
        leagueId={resolvedParams.id}
        initialViewModel={viewModel}
      />
    );
  } catch (error) {
    console.error("Error fetching league detail:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดข้อมูลตารางคะแนนได้
          </p>
          <Link
            href="/leagues"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            กลับไปหน้ารายการลีก
          </Link>
        </div>
      </div>
    );
  }
}
