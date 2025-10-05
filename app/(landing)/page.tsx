import { LandingView } from "@/src/presentation/components/landing/LandingView";
import { LandingPresenterFactory } from "@/src/presentation/presenters/landing/LandingPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the landing page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await LandingPresenterFactory.create();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "Soccer Tactics - แพลตฟอร์มวิเคราะห์แทคติคฟุตบอล",
      description:
        "แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล พร้อมระบบตารางคะแนนลีกและ Live Score",
    };
  }
}

/**
 * Landing Page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function Home() {
  const presenter = await LandingPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <LandingView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching landing data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดข้อมูลได้
          </p>
          <Link
            href="/"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            ลองใหม่อีกครั้ง
          </Link>
        </div>
      </div>
    );
  }
}
