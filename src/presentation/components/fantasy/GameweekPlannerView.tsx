"use client";

import type { GameweekPlannerViewModel } from "@/src/presentation/presenters/fantasy/GameweekPlannerPresenter";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface GameweekPlannerViewProps {
  viewModel: GameweekPlannerViewModel;
}

export default function GameweekPlannerView({
  viewModel,
}: GameweekPlannerViewProps) {
  const {
    currentGameweek,
    myPlayers,
    teamFixtureRuns,
    bestFixtures,
    worstFixtures,
    transferPlans,
    upcomingBlanks,
    upcomingDoubles,
  } = viewModel;

  const [selectedTab, setSelectedTab] = useState<
    "myTeam" | "teams" | "players" | "plans"
  >("myTeam");

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "bg-green-500";
    if (difficulty === 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "excellent":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "average":
        return "text-gray-600 bg-gray-100 dark:bg-gray-700/30";
      case "poor":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "terrible":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gameweek Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            วางแผนล่วงหน้า 5 Gameweek ถัดไป
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Gameweek ปัจจุบัน: {currentGameweek}
          </p>
        </div>

        {/* Blank & Double Gameweeks Alert */}
        {(upcomingBlanks.length > 0 || upcomingDoubles.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {upcomingBlanks.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-orange-900 dark:text-orange-200">
                    Blank Gameweeks
                  </h3>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  GW: {upcomingBlanks.join(", ")} - บางทีมไม่มีแมตช์
                </p>
              </div>
            )}
            {upcomingDoubles.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-900 dark:text-green-200">
                    Double Gameweeks
                  </h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-300">
                  GW: {upcomingDoubles.join(", ")} - บางทีมแข่ง 2 นัด
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("myTeam")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "myTeam"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ทีมของฉัน
          </button>
          <button
            onClick={() => setSelectedTab("teams")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "teams"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ตารางทีม
          </button>
          <button
            onClick={() => setSelectedTab("players")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "players"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            นักเตะแนะนำ
          </button>
          <button
            onClick={() => setSelectedTab("plans")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "plans"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            แผนการย้าย
          </button>
        </div>

        {/* My Team Tab */}
        {selectedTab === "myTeam" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                นักเตะในทีม - ตารางแข่ง 5 นัดถัดไป
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        นักเตะ
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW+1
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW+2
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW+3
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW+4
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        GW+5
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        เฉลี่ย
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        คำแนะนำ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myPlayers.map((player, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {player.name.split(" ").pop()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {player.team}
                            </p>
                          </div>
                        </td>
                        {player.next5Fixtures.map((fixture, fIdx) => (
                          <td key={fIdx} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getDifficultyColor(
                                  fixture.difficulty
                                )}`}
                              >
                                {fixture.difficulty}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {fixture.isHome ? "H" : "A"}
                              </p>
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {player.averageDifficulty.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {player.recommendation === "buy" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                              <TrendingUp className="w-3 h-3" />
                              ซื้อ
                            </span>
                          )}
                          {player.recommendation === "hold" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                              <CheckCircle className="w-3 h-3" />
                              เก็บ
                            </span>
                          )}
                          {player.recommendation === "sell" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded">
                              <TrendingDown className="w-3 h-3" />
                              ขาย
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {selectedTab === "teams" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ตารางแข่งของแต่ละทีม
            </h2>
            <div className="space-y-4">
              {teamFixtureRuns.map((team, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        เฉลี่ย: {team.averageDifficulty.toFixed(1)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                        team.rating
                      )}`}
                    >
                      {team.rating === "excellent" && "ดีเยี่ยม"}
                      {team.rating === "good" && "ดี"}
                      {team.rating === "average" && "ปานกลาง"}
                      {team.rating === "poor" && "แย่"}
                      {team.rating === "terrible" && "แย่มาก"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {team.next5Fixtures.map((fixture, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                      >
                        <div
                          className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold ${getDifficultyColor(
                            fixture.difficulty
                          )}`}
                        >
                          {fixture.difficulty}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {fixture.opponent}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fixture.isHome ? "เหย้า" : "เยือน"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players Tab */}
        {selectedTab === "players" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Fixtures */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ตารางแข่งง่าย
                </h2>
              </div>
              <div className="space-y-3">
                {bestFixtures.slice(0, 5).map((player, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {player.name.split(" ").pop()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {player.team} • £{player.price}m
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {player.averageDifficulty.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">เฉลี่ย</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {player.next5Fixtures.map((f, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded ${getDifficultyColor(
                            f.difficulty
                          )}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst Fixtures */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ตารางแข่งยาก
                </h2>
              </div>
              <div className="space-y-3">
                {worstFixtures.slice(0, 5).map((player, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {player.name.split(" ").pop()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {player.team} • £{player.price}m
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {player.averageDifficulty.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">เฉลี่ย</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {player.next5Fixtures.map((f, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded ${getDifficultyColor(
                            f.difficulty
                          )}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {selectedTab === "plans" && (
          <div className="space-y-6">
            {transferPlans.map((plan, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Gameweek {plan.gameweek}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transfers Out */}
                  {plan.transfersOut.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-3 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        ขายออก
                      </p>
                      <div className="space-y-2">
                        {plan.transfersOut.map((transfer, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {transfer.player.name.split(" ").pop()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {transfer.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transfers In */}
                  {plan.transfersIn.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        ซื้อเข้า
                      </p>
                      <div className="space-y-2">
                        {plan.transfersIn.map((transfer, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {transfer.player.name.split(" ").pop()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {transfer.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
