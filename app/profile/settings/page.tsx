import { UserSettingsView } from "@/src/presentation/components/users/UserSettingsView";
import { UserSettingsPresenterFactory } from "@/src/presentation/presenters/users/UserSettingsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Generate metadata for the user settings page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = UserSettingsPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตั้งค่าบัญชี | Soccer Tactics",
      description: "จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ",
    };
  }
}

/**
 * User Settings Page - Server Component for SEO optimization
 */
export default async function UserSettingsPage() {
  const presenter = UserSettingsPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <UserSettingsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching user settings:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดการตั้งค่าได้
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
