import { GroupDetailView } from "@/src/presentation/components/group-detail/GroupDetailView";
import { GroupDetailPresenterFactory } from "@/src/presentation/presenters/group-detail/GroupDetailPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const presenter = await GroupDetailPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(id);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "Group | Community - Soccer Tactics",
      description: "Join and engage with football fans in this community group",
    };
  }
}

/**
 * Group Detail page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const presenter = await GroupDetailPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(id);

    return <GroupDetailView groupId={id} initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching group detail:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">👥</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            ไม่พบกลุ่ม
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ขออภัย กลุ่มที่คุณกำลังค้นหาไม่มีอยู่หรือถูกลบไปแล้ว
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/community"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              กลับไปหน้าชุมชน
            </Link>
            <Link
              href="/"
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl border border-gray-300 dark:border-gray-700"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
