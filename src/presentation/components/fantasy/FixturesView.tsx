"use client";

import type { FixturesViewModel } from "@/src/presentation/presenters/fantasy/FixturesPresenter";
import { Calendar, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

interface FixturesViewProps {
  viewModel: FixturesViewModel;
}

export default function FixturesView({ viewModel }: FixturesViewProps) {
  const { currentGameweek, currentFixtures, teamFixtureDifficulty, topPlayers } =
    viewModel;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"fixtures" | "players">(
    "fixtures"
  );

  // Filter players
  const filteredPlayers = topPlayers.byPoints.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Difficulty color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "bg-green-500";
    if (difficulty <= 3) return "bg-yellow-500";
    if (difficulty <= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return "ง่าย";
    if (difficulty <= 3) return "ปานกลาง";
    if (difficulty <= 4) return "ยาก";
    return "ยากมาก";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ตารางแข่งและสถิตินักเตะ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentGameweek?.name} - วิเคราะห์ความยากของคู่แข่ง
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("fixtures")}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === "fixtures"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              ตารางแข่งขัน
            </button>
            <button
              onClick={() => setSelectedTab("players")}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === "players"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              สถิตินักเตะ
            </button>
          </div>
        </div>

        {selectedTab === "fixtures" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Gameweek Fixtures */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {currentGameweek?.name}
                    </h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentFixtures.map((fixture) => (
                    <div
                      key={fixture.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {fixture.homeTeam}
                          </p>
                        </div>
                        <div className="px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${getDifficultyColor(fixture.difficulty.home)}`}
                            ></span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              vs
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${getDifficultyColor(fixture.difficulty.away)}`}
                            ></span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {fixture.awayTeam}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        {new Date(fixture.kickoffTime).toLocaleString("th-TH", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixture Difficulty */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  ความยากของคู่แข่ง
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  5 นัดถัดไป (เรียงจากง่ายไปยาก)
                </p>
                <div className="space-y-3">
                  {teamFixtureDifficulty.slice(0, 10).map((team) => (
                    <div
                      key={team.teamId}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {team.teamName}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            team.averageDifficulty <= 2
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                              : team.averageDifficulty <= 3
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {getDifficultyText(team.averageDifficulty)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {team.nextFixtures.slice(0, 5).map((fixture, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-2 rounded ${getDifficultyColor(fixture.difficulty)}`}
                            title={`${fixture.opponent} (${getDifficultyText(fixture.difficulty)})`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Stats Table */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ค้นหานักเตะ..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          นักเตะ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          ทีม
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          คะแนน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          ฟอร์ม
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          ราคา
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          เจ้าของ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredPlayers.map((player) => (
                        <tr
                          key={player.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {player.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {player.position}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {player.team}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                            {player.totalPoints}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {player.form.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            £{player.price}m
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {player.ownership.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Players Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ฟอร์มดีที่สุด
                  </h3>
                </div>
                <div className="space-y-3">
                  {topPlayers.byForm.slice(0, 5).map((player, idx) => (
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
                            {player.name.split(" ").pop()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {player.team}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {player.form.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-3">
                  คำอธิบายความยาก
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-blue-800 dark:text-blue-300">
                      ง่าย (1-2)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-blue-800 dark:text-blue-300">
                      ปานกลาง (3)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-blue-800 dark:text-blue-300">
                      ยาก (4)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-blue-800 dark:text-blue-300">
                      ยากมาก (5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
