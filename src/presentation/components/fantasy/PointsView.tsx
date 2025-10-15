"use client";

import type { PointsViewModel } from "@/src/presentation/presenters/fantasy/PointsPresenter";
import {
  Award,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";

interface PointsViewProps {
  viewModel: PointsViewModel;
}

export default function PointsView({ viewModel }: PointsViewProps) {
  const { team, gameweekHistory, seasonStats, topPerformers, rankProgression } =
    viewModel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            คะแนนและสถิติ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ติดตามผลงานของทีม {team.teamName}
          </p>
        </div>

        {/* Season Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนรวม
              </p>
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {seasonStats.totalPoints}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              เฉลี่ย {seasonStats.averagePoints.toFixed(1)} ต่อ GW
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนสูงสุด
              </p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {seasonStats.highestScore}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              GW {seasonStats.bestGameweek}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนต่ำสุด
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {seasonStats.lowestScore}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              GW {seasonStats.worstGameweek}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                การย้าย
              </p>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {seasonStats.totalTransfers}
            </p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              -{seasonStats.totalTransferCost} คะแนน
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gameweek History */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ประวัติ Gameweek
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        คะแนน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        อันดับ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        ย้าย
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Chip
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {gameweekHistory
                      .slice()
                      .reverse()
                      .map((gw) => (
                        <tr
                          key={gw.gameweek}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {gw.gameweek}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {gw.points}
                            </span>
                            {gw.transferCost > 0 && (
                              <span className="ml-2 text-xs text-red-600">
                                (-{gw.transferCost})
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {gw.rank.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {gw.transfers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {gw.chipUsed ? (
                              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded">
                                {gw.chipUsed === "tripleCaptain"
                                  ? "3xC"
                                  : gw.chipUsed === "benchBoost"
                                    ? "BB"
                                    : gw.chipUsed}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rank Progression Chart */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                การเปลี่ยนแปลงอันดับ
              </h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {rankProgression.slice(-10).map((item, idx) => {
                  const maxRank = Math.max(
                    ...rankProgression.slice(-10).map((r) => r.rank)
                  );
                  const height = ((maxRank - item.rank) / maxRank) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
                        style={{ height: `${Math.max(height, 10)}%` }}
                      ></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {item.gameweek}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="space-y-6">
            {/* By Points */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  คะแนนสูงสุด
                </h3>
              </div>
              <div className="space-y-3">
                {topPerformers.byPoints.slice(0, 5).map((perf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {perf.player.name.split(" ").pop()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {perf.player.team}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {perf.totalPoints}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ประตูสูงสุด
                </h3>
              </div>
              <div className="space-y-3">
                {topPerformers.byGoals.slice(0, 5).map((perf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {perf.player.name.split(" ").pop()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {perf.player.team}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {perf.goals}⚽
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
