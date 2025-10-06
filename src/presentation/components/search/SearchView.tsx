"use client";

import type { SearchViewModel } from "@/src/presentation/presenters/search/SearchPresenter";
import { useSearchPresenter } from "@/src/presentation/presenters/search/useSearchPresenter";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchViewProps {
  initialViewModel?: SearchViewModel;
  initialQuery?: string;
}

export function SearchView({ initialViewModel, initialQuery }: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, actions] = useSearchPresenter(
    initialViewModel,
    initialQuery || searchParams.get("q") || ""
  );
  const viewModel = state.viewModel;
  const [searchInput, setSearchInput] = useState(state.query);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
      actions.search(searchInput);
    }
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ค้นหา
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ค้นหาบทวิเคราะห์, ทีม, การแข่งขัน..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-xl">
                🔍
              </span>
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {state.query && viewModel && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                พบ <span className="font-semibold">{viewModel.totalResults}</span>{" "}
                ผลลัพธ์สำหรับ &quot;
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {state.query}
                </span>
                &quot;
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                  onClick={() => actions.setActiveTab("all")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    state.activeTab === "all"
                      ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  ทั้งหมด ({viewModel.totalResults})
                </button>
                <button
                  onClick={() => actions.setActiveTab("posts")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    state.activeTab === "posts"
                      ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  บทวิเคราะห์ ({viewModel.posts.length})
                </button>
                <button
                  onClick={() => actions.setActiveTab("teams")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    state.activeTab === "teams"
                      ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  ทีม ({viewModel.teams.length})
                </button>
                <button
                  onClick={() => actions.setActiveTab("matches")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    state.activeTab === "matches"
                      ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  การแข่งขัน ({viewModel.matches.length})
                </button>
              </div>
            </div>

            {/* Results Content */}
            {viewModel.totalResults === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                  ไม่พบผลลัพธ์
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  ลองค้นหาด้วยคำอื่น
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Posts Results */}
                {(state.activeTab === "all" || state.activeTab === "posts") &&
                  viewModel.posts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        บทวิเคราะห์
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {viewModel.posts.map((post) => (
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
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                              <span>👍 {post.upvotes}</span>
                              <span>💬 {post.comments}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Teams Results */}
                {(state.activeTab === "all" || state.activeTab === "teams") &&
                  viewModel.teams.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        ทีม
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {viewModel.teams.map((team) => (
                          <Link
                            key={team.id}
                            href={`/teams/${team.id}`}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex items-center space-x-3"
                          >
                            <span className="text-4xl">{team.logo}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                {team.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {team.league}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Matches Results */}
                {(state.activeTab === "all" || state.activeTab === "matches") &&
                  viewModel.matches.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        การแข่งขัน
                      </h2>
                      <div className="space-y-3">
                        {viewModel.matches.map((match) => (
                          <Link
                            key={match.id}
                            href={`/matches/${match.id}`}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {match.homeTeam} vs {match.awayTeam}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(match.date).toLocaleDateString("th-TH")}
                              </p>
                            </div>
                            {match.score && (
                              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {match.score.home} - {match.score.away}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!state.query && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
              เริ่มค้นหา
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              ค้นหาบทวิเคราะห์, ทีม, หรือการแข่งขัน
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
