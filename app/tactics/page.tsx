import { TacticsView } from "@/src/presentation/components/tactics/TacticsView";
import { TacticsPresenterFactory } from "@/src/presentation/presenters/tactics/TacticsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Generate metadata for the tactics page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = TacticsPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "วิเคราะห์แทคติคฟุตบอล | Soccer Tactics",
      description: "อ่านบทวิเคราะห์แทคติคฟุตบอลจากนักวิเคราะห์มืออาชีพ",
    };
  }
}

/**
 * Tactics Page - Server Component for SEO optimization
 */
export default async function TacticsPage() {
  const presenter = TacticsPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <TacticsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching tactics data:", error);

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
