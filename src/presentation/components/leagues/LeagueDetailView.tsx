"use client";

import type { LeagueDetailViewModel } from "@/src/presentation/presenters/leagues/LeagueDetailPresenter";
import { useLeagueDetailPresenter } from "@/src/presentation/presenters/leagues/useLeagueDetailPresenter";
import Link from "next/link";

interface LeagueDetailViewProps {
  leagueId: string;
  initialViewModel?: LeagueDetailViewModel;
}

export function LeagueDetailView({
  leagueId,
  initialViewModel,
}: LeagueDetailViewProps) {
  const [state, actions] = useLeagueDetailPresenter(leagueId, initialViewModel);
  const league = state.viewModel?.league;
  const standings = state.viewModel?.standings || [];
  const topScorers = state.viewModel?.topScorers || [];
  const upcomingFixtures = state.viewModel?.upcomingFixtures || [];

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

  const getPositionColor = (position: number, totalTeams: number) => {
    if (position <= 4) {
      return "bg-blue-50 dark:bg-blue-900/20"; // Champions League
    } else if (position <= 6) {
      return "bg-green-50 dark:bg-green-900/20"; // Europa League
    } else if (position > totalTeams - 3) {
      return "bg-red-50 dark:bg-red-900/20"; // Relegation
    }
    return "";
  };

  // Loading state
  if (state.loading && !league) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลตารางคะแนน...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error || !league) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                ไม่พบข้อมูลลีก
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error || "ไม่พบข้อมูลลีกที่คุณต้องการ"}
              </p>
              <Link
                href="/leagues"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                กลับไปหน้ารายการลีก
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
          href="/leagues"
          className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-6"
        >
          <span className="mr-2">←</span>
          กลับไปหน้ารายการลีก
        </Link>

        {/* League Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-6xl">{league.logo}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {league.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {league.country} • ฤดูกาล {league.season}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                นัดการแข่งขัน
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {league.currentMatchday}/{league.totalMatchdays}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => actions.setFilter("overall")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                state.filter === "overall"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => actions.setFilter("home")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                state.filter === "home"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              เหย้า
            </button>
            <button
              onClick={() => actions.setFilter("away")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                state.filter === "away"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              เยือน
            </button>
          </div>
        </div>

        {/* Standings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ตารางคะแนน
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    อันดับ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ทีม
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    แข่ง
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ชนะ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    เสมอ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    แพ้
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ได้
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    เสีย
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    +/-
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    คะแนน
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ฟอร์ม
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {standings.map((standing) => (
                  <tr
                    key={standing.team.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getPositionColor(
                      standing.position,
                      league.totalTeams
                    )}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {standing.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/teams/${standing.team.id}`}
                        className="flex items-center space-x-3 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        <span className="text-2xl">{standing.team.logo}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {standing.team.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {standing.team.shortName}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                      {standing.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span
                        className={
                          standing.goalDifference > 0
                            ? "text-green-600 dark:text-green-400 font-semibold"
                            : standing.goalDifference < 0
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : "text-gray-900 dark:text-gray-100"
                        }
                      >
                        {standing.goalDifference > 0 ? "+" : ""}
                        {standing.goalDifference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {standing.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {standing.form.map((result, index) => (
                          <span key={index} className="text-sm">
                            {getFormIcon(result)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded"></div>
                <span>Champions League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
                <span>Europa League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 rounded"></div>
                <span>Relegation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Scorers */}
          {topScorers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                ดาวซัลโว
              </h3>
              <div className="space-y-3">
                {topScorers.map((scorer, index) => (
                  <div
                    key={scorer.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <span className="text-xl">{scorer.teamLogo}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {scorer.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {scorer.team}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {scorer.goals}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ⚽ {scorer.goals} 🎯 {scorer.assists}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Fixtures */}
          {upcomingFixtures.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                นัดการแข่งขันถัดไป
              </h3>
              <div className="space-y-3">
                {upcomingFixtures.map((fixture) => (
                  <div
                    key={fixture.id}
                    className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(fixture.date).toLocaleDateString("th-TH", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {fixture.time}
                      </span>
                      <span>📍 {fixture.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
