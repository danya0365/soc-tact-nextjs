import { TacticDetailView } from "@/src/presentation/components/tactics/TacticDetailView";
import { TacticDetailPresenterFactory } from "@/src/presentation/presenters/tactics/TacticDetailPresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface TacticDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the tactic detail page
 */
export async function generateMetadata({
  params,
}: TacticDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = TacticDetailPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(resolvedParams.id);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "วิเคราะห์แทคติคฟุตบอล | Soccer Tactics",
      description: "อ่านบทวิเคราะห์แทคติคฟุตบอล",
    };
  }
}

/**
 * Tactic Detail Page - Server Component for SEO optimization
 */
export default async function TacticDetailPage({
  params,
}: TacticDetailPageProps) {
  const resolvedParams = await params;
  const presenter = TacticDetailPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(resolvedParams.id);

    return (
      <TacticDetailView postId={resolvedParams.id} initialViewModel={viewModel} />
    );
  } catch (error) {
    console.error("Error fetching tactic detail:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดบทวิเคราะห์ได้
          </p>
          <Link
            href="/tactics"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            กลับไปหน้ารายการ
          </Link>
        </div>
      </div>
    );
  }
}
