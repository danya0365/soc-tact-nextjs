"use client";

import type { ExploreViewModel } from "@/src/presentation/presenters/explore/ExplorePresenter";
import { useExplorePresenter } from "@/src/presentation/presenters/explore/useExplorePresenter";
import Link from "next/link";

interface ExploreViewProps {
  initialViewModel?: ExploreViewModel;
}

export function ExploreView({ initialViewModel }: ExploreViewProps) {
  const [state] = useExplorePresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            สำรวจ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ค้นพบบทวิเคราะห์ยอดนิยม นักวิเคราะห์แนะนำ และหัวข้อที่กำลังฮิต
          </p>
        </div>

        {/* Trending Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              🔥 บทวิเคราะห์ยอดนิยม
            </h2>
            <Link
              href="/tactics?sort=trending"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewModel.trendingPosts.map((post) => (
              <Link
                key={post.id}
                href={`/tactics/${post.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{post.thumbnail}</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                    {post.formation}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{post.author.avatar}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {post.author.name}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    👁️ {formatNumber(post.views)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Analysts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ⭐ นักวิเคราะห์แนะนำ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {viewModel.featuredAnalysts.map((analyst) => (
              <Link
                key={analyst.id}
                href={`/profile/${analyst.username}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-center"
              >
                <span className="text-6xl mb-3 block">{analyst.avatar}</span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {analyst.displayName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  @{analyst.username}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {analyst.stats.posts}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">บทความ</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {formatNumber(analyst.stats.upvotes)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">โหวต</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {analyst.stats.followers}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">ติดตาม</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Formations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              📊 ฟอร์เมชั่นยอดนิยม
            </h2>
            <div className="space-y-3">
              {viewModel.popularFormations.map((formation, index) => (
                <Link
                  key={formation.formation}
                  href={`/tactics?formation=${formation.formation}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}
                    </span>
                    <span className="text-2xl">{formation.icon}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formation.formation}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formation.count} บทความ
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hot Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🔥 หัวข้อที่กำลังฮิต
            </h2>
            <div className="flex flex-wrap gap-2">
              {viewModel.hotTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/tactics?tag=${topic}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                >
                  #{topic}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* League Highlights */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              🏆 ลีกชั้นนำ
            </h2>
            <Link
              href="/leagues"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {viewModel.leagueHighlights.map((league) => (
              <Link
                key={league.id}
                href={`/leagues/${league.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 text-center"
              >
                <span className="text-4xl mb-2 block">{league.logo}</span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  {league.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {league.country}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
