import { SearchView } from "@/src/presentation/components/search/SearchView";
import { SearchPresenterFactory } from "@/src/presentation/presenters/search/SearchPresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

/**
 * Generate metadata for the search page
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const presenter = SearchPresenterFactory.createServer();

  try {
    return await presenter.generateMetadata(resolvedParams.q);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ค้นหา | Soccer Tactics",
      description: "ค้นหาบทวิเคราะห์แทคติค ทีม และการแข่งขัน",
    };
  }
}

/**
 * Search Page - Server Component for SEO optimization
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const presenter = SearchPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(resolvedParams.q || "");

    return (
      <SearchView initialViewModel={viewModel} initialQuery={resolvedParams.q} />
    );
  } catch (error) {
    console.error("Error fetching search results:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถค้นหาได้
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
