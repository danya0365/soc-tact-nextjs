import { MatchDetailView } from "@/src/presentation/components/matches/MatchDetailView";
import { MatchDetailPresenterFactory } from "@/src/presentation/presenters/matches/MatchDetailPresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the match detail page
 */
export async function generateMetadata({
  params,
}: MatchDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = MatchDetailPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(resolvedParams.id);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "รายละเอียดการแข่งขัน | Soccer Tactics",
      description: "ดูรายละเอียดการแข่งขัน สถิติ และไฮไลท์",
    };
  }
}

/**
 * Match Detail Page - Server Component for SEO optimization
 */
export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const resolvedParams = await params;
  const presenter = MatchDetailPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(resolvedParams.id);

    return (
      <MatchDetailView
        matchId={resolvedParams.id}
        initialViewModel={viewModel}
      />
    );
  } catch (error) {
    console.error("Error fetching match detail:", error);

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
            href="/matches"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            กลับไปหน้ารายการแข่งขัน
          </Link>
        </div>
      </div>
    );
  }
}
