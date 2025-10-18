"use client";

import type {
  MatchFilters,
  MatchesViewModel,
} from "@/src/presentation/presenters/matches/MatchesPresenter";
import { useMatchesPresenter } from "@/src/presentation/presenters/matches/useMatchesPresenter";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { MatchesViewSkeleton } from "./MatchesViewSkeleton";

interface MatchesViewProps {
  initialViewModel?: MatchesViewModel;
}

export function MatchesView({ initialViewModel }: MatchesViewProps) {
  const [state, actions] = useMatchesPresenter(initialViewModel);
  const viewModel = state.viewModel;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "finished":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "postponed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "กำลังแข่ง";
      case "finished":
        return "จบการแข่งขัน";
      case "upcoming":
        return "ยังไม่เริ่ม";
      case "postponed":
        return "เลื่อน";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Show loading only on initial load
  if (state.loading && !viewModel?.matches.length) {
    return <MatchesViewSkeleton />;
  }

  // Show error state
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
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลการแข่งขัน
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ผลบอลสด - Match Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ติดตามผลบอลสดและตารางแข่งขันจากลีกชั้นนำทั่วโลก
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ทั้งหมด
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.totalMatches}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <span className="text-2xl">🔴</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  กำลังแข่ง
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.liveMatches}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  จบแล้ว
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.finishedMatches}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  กำลังจะแข่ง
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.stats.upcomingMatches}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                วันที่แข่งขัน
              </label>
              <input
                type="date"
                value={state.filters.date || today}
                max={today}
                onChange={(e) =>
                  actions.setFilters({
                    ...state.filters,
                    date: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                สถานะ
              </label>
              <select
                value={state.filters.status || "all"}
                onChange={(e) => {
                  const nextStatus = e.target.value as MatchFilters["status"];
                  actions.setFilters({
                    ...state.filters,
                    status: nextStatus,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">ทั้งหมด</option>
                <option value="live">กำลังแข่ง</option>
                <option value="finished">จบแล้ว</option>
                <option value="upcoming">กำลังจะแข่ง</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                placeholder="ค้นหาทีม, ลีก..."
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
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {viewModel.matches.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ไม่พบข้อมูลการแข่งขัน
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                ลองเปลี่ยนตัวกรองหรือค้นหาใหม่
              </p>
            </div>
          ) : (
            viewModel.matchesByLeague.map((leagueGroup) => {
              const leagueInfo = leagueGroup.matches[0]?.league;
              return (
                <div key={leagueGroup.league} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {leagueInfo?.logo && (
                        <>
                          {leagueInfo.logo.startsWith("http") ? (
                            <Image
                              src={leagueInfo.logo}
                              alt={leagueInfo.name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-xl">{leagueInfo.logo}</span>
                          )}
                        </>
                      )}
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {leagueGroup.league}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {leagueGroup.matches.length} นัดแข่งขัน
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {leagueGroup.matches.map((match) => (
                      <Link
                        key={match.id}
                        href={`/matches/${match.id}`}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              match.status
                            )}`}
                          >
                            {match.status === "live" && match.minute
                              ? `${match.minute}'`
                              : getStatusText(match.status)}
                          </span>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {match.league.country}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          {/* Home Team */}
                          <div className="text-right">
                            <div className="flex items-center justify-end space-x-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {match.homeTeam.name}
                              </span>
                              {match.homeTeam.logo.startsWith("http") ? (
                                <Image
                                  src={match.homeTeam.logo}
                                  alt={match.homeTeam.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-2xl">
                                  {match.homeTeam.logo}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {match.homeTeam.shortName}
                            </span>
                          </div>

                          {/* Score */}
                          <div className="text-center">
                            {match.status === "upcoming" ? (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <div>{formatDate(match.date)}</div>
                                <div className="font-semibold">
                                  {formatTime(match.time)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {match.score.home} - {match.score.away}
                              </div>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="text-left">
                            <div className="flex items-center space-x-2 mb-1">
                              {match.awayTeam.logo.startsWith("http") ? (
                                <Image
                                  src={match.awayTeam.logo}
                                  alt={match.awayTeam.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-2xl">
                                  {match.awayTeam.logo}
                                </span>
                              )}
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {match.awayTeam.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {match.awayTeam.shortName}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span>📍 {match.venue.name}</span>
                              {match.referee && <span>👨‍⚖️ {match.referee}</span>}
                            </div>
                            {match.status !== "upcoming" && (
                              <span>{formatDate(match.date)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {state.hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={actions.loadMore}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors"
            >
              โหลดเพิ่มเติม
            </button>
          </div>
        )}

        {/* Error Toast */}
        {state.error && viewModel && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{state.error}</span>
              <button
                onClick={() => actions.setError(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
