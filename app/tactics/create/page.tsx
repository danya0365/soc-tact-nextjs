import { CreateTacticView } from "@/src/presentation/components/tactics/CreateTacticView";
import { CreateTacticPresenterFactory } from "@/src/presentation/presenters/tactics/CreateTacticPresenter";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Generate metadata for the create tactic page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = CreateTacticPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "สร้างบทวิเคราะห์แทคติค | Soccer Tactics",
      description: "เขียนบทวิเคราะห์แทคติคฟุตบอลของคุณและแชร์กับชุมชน",
    };
  }
}

/**
 * Create Tactic Page - Server Component for SEO optimization
 */
export default async function CreateTacticPage() {
  const presenter = CreateTacticPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <CreateTacticView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching create tactic data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดฟอร์มสร้างบทความได้
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
