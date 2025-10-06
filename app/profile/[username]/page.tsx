import { UserProfileView } from "@/src/presentation/components/users/UserProfileView";
import { UserProfilePresenterFactory } from "@/src/presentation/presenters/users/UserProfilePresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

/**
 * Generate metadata for the user profile page
 */
export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = UserProfilePresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(resolvedParams.username);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "โปรไฟล์ผู้ใช้ | Soccer Tactics",
      description: "ดูโปรไฟล์และบทวิเคราะห์ของนักวิเคราะห์",
    };
  }
}

/**
 * User Profile Page - Server Component for SEO optimization
 */
export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const resolvedParams = await params;
  const presenter = UserProfilePresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(resolvedParams.username);

    return (
      <UserProfileView
        username={resolvedParams.username}
        initialViewModel={viewModel}
      />
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้
          </p>
          <Link
            href="/tactics"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }
}
