"use client";

import type { TeamDetailViewModel } from "@/src/presentation/presenters/teams/TeamDetailPresenter";
import { useTeamDetailPresenter } from "@/src/presentation/presenters/teams/useTeamDetailPresenter";
import Link from "next/link";

interface TeamDetailViewProps {
  teamId: string;
  initialViewModel?: TeamDetailViewModel;
}

export function TeamDetailView({
  teamId,
  initialViewModel,
}: TeamDetailViewProps) {
  const [state] = useTeamDetailPresenter(teamId, initialViewModel);
  const team = state.viewModel?.team;
  const squad = state.viewModel?.squad || [];
  const recentMatches = state.viewModel?.recentMatches || [];
  const upcomingMatches = state.viewModel?.upcomingMatches || [];
  const tacticalPosts = state.viewModel?.tacticalPosts || [];

  // Helper functions
  const getFormIcon = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W":
        return "🟢";
      case "D":
        return "🟡";
      case "L":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  // Loading state
  if (state.loading && !team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลทีม...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                ไม่พบข้อมูลทีม
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error || "ไม่พบข้อมูลทีมที่คุณต้องการ"}
              </p>
              <Link
                href="/leagues"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                กลับไปหน้าลีก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/leagues/${team.league.id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-6"
        >
          <span className="mr-2">←</span>
          กลับไป {team.league.name}
        </Link>

        {/* Team Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <span className="text-8xl">{team.logo}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {team.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {team.league.name} • ก่อตั้ง {team.founded}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>📍 {team.stadium.name}</span>
                  <span>👥 {team.stadium.capacity.toLocaleString()} ที่นั่ง</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                อันดับ
              </p>
              <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                {team.stats.position}
              </p>
            </div>
          </div>

          {/* Manager Info */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ผู้จัดการทีม
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {team.manager.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {team.manager.nationality} • ดำรงตำแหน่งตั้งแต่{" "}
                  {new Date(team.manager.since).getFullYear()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {team.stats.form.map((result, index) => (
                  <span key={index} className="text-2xl">
                    {getFormIcon(result)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {team.stats.points}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              คะแนน
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {team.stats.won}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ชนะ
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {team.stats.goalsFor}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ประตูได้
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {team.stats.goalsAgainst}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ประตูเสีย
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Squad */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              ผู้เล่น
            </h2>
            <div className="space-y-3">
              {squad.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">
                      {player.number}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {player.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {player.position} • {player.nationality} • {player.age} ปี
                      </p>
                    </div>
                  </div>
                  {(player.goals !== undefined || player.assists !== undefined) && (
                    <div className="flex items-center space-x-4 text-sm">
                      {player.goals !== undefined && (
                        <span className="text-gray-600 dark:text-gray-400">
                          ⚽ {player.goals}
                        </span>
                      )}
                      {player.assists !== undefined && (
                        <span className="text-gray-600 dark:text-gray-400">
                          🎯 {player.assists}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Matches */}
          <div className="space-y-6">
            {/* Recent Matches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                ผลการแข่งขันล่าสุด
              </h3>
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{match.opponentLogo}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {match.opponent}
                        </span>
                      </div>
                      {match.score && (
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {match.isHome
                            ? `${match.score.home}-${match.score.away}`
                            : `${match.score.away}-${match.score.home}`}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(match.date)} • {match.competition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Matches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                นัดการแข่งขันถัดไป
              </h3>
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{match.opponentLogo}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {match.opponent}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {match.isHome ? "เหย้า" : "เยือน"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(match.date)} • {match.competition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Analysis */}
        {tacticalPosts.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              บทวิเคราะห์แทคติค
            </h2>
            <div className="space-y-4">
              {tacticalPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/tactics/${post.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                      {post.formation}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>👍 {post.upvotes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
