"use client";

import type { TacticsViewModel } from "@/src/presentation/presenters/tactics/TacticsPresenter";
import { useTacticsPresenter } from "@/src/presentation/presenters/tactics/useTacticsPresenter";
import Link from "next/link";

interface TacticsViewProps {
  initialViewModel?: TacticsViewModel;
}

export function TacticsView({ initialViewModel }: TacticsViewProps) {
  const [state, actions] = useTacticsPresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดบทวิเคราะห์...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error}
              </p>
              <button
                onClick={actions.refreshData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🎨</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีบทวิเคราะห์
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            วิเคราะห์แทคติคฟุตบอล
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            อ่านบทวิเคราะห์แทคติคจากนักวิเคราะห์มืออาชีพ
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  บทความทั้งหมด
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.totalPosts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  นักวิเคราะห์
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.totalAuthors}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ยอดเข้าชม
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatNumber(viewModel.stats.totalViews)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ความคิดเห็น
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.totalComments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                placeholder="ค้นหาบทความ, แท็ก..."
                value={state.filters.searchQuery || ""}
                onChange={(e) =>
                  actions.setFilters({
                    ...state.filters,
                    searchQuery: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Formation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ฟอร์เมชั่น
              </label>
              <select
                value={state.filters.formation || ""}
                onChange={(e) =>
                  actions.setFilters({
                    ...state.filters,
                    formation: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">ทั้งหมด</option>
                {viewModel.availableFormations.map((formation) => (
                  <option key={formation} value={formation}>
                    {formation}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                เรียงตาม
              </label>
              <select
                value={state.filters.sortBy || "latest"}
                onChange={(e) =>
                  actions.setFilters({
                    ...state.filters,
                    sortBy: e.target.value as "latest" | "popular" | "trending",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="latest">ล่าสุด</option>
                <option value="popular">ยอดนิยม</option>
                <option value="trending">กำลังฮิต</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {viewModel.posts.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🎨</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ไม่พบบทวิเคราะห์
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                ลองเปลี่ยนตัวกรองหรือค้นหาใหม่
              </p>
            </div>
          ) : (
            viewModel.posts.map((post) => (
              <Link
                key={post.id}
                href={`/tactics/${post.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{post.thumbnail}</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                      {post.formation}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{post.author.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="mr-1">👍</span>
                        {post.upvotes}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">💬</span>
                        {post.comments}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <span className="mr-1">👁️</span>
                      {formatNumber(post.views)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {viewModel.totalCount > viewModel.perPage && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => actions.setCurrentPage(state.currentPage - 1)}
                disabled={state.currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                ก่อนหน้า
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                หน้า {state.currentPage} จาก{" "}
                {Math.ceil(viewModel.totalCount / viewModel.perPage)}
              </span>
              <button
                onClick={() => actions.setCurrentPage(state.currentPage + 1)}
                disabled={
                  state.currentPage ===
                  Math.ceil(viewModel.totalCount / viewModel.perPage)
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
