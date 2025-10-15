"use client";

import type { LeagueDetailViewModel } from "@/src/presentation/presenters/fantasy/LeagueDetailPresenter";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Crown,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { MY_FANTASY_TEAM } from "@/src/data/mock/fantasy/teams.mock";
import Link from "next/link";
import { useState } from "react";

interface LeagueDetailViewProps {
  viewModel: LeagueDetailViewModel;
}

export default function LeagueDetailView({
  viewModel,
}: LeagueDetailViewProps) {
  const { league, standings, myPosition, stats, gameweekHistory, topRisers, topFallers } =
    viewModel;

  const [selectedTab, setSelectedTab] = useState<
    "standings" | "stats" | "history" | "movers"
  >("standings");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/fantasy/leagues"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← กลับไปลีก
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {league.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {league.type === "global" ? "ลีกโลก" : "ลีกส่วนตัว"}
              </p>
              {league.code && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  รหัสลีก: <span className="font-mono font-bold">{league.code}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalManagers}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ผู้เล่น</p>
            </div>
          </div>
        </div>

        {/* My Position Card */}
        {myPosition && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">ตำแหน่งของคุณ</p>
                <h2 className="text-3xl font-bold">อันดับ {myPosition.rank}</h2>
                <p className="text-blue-200 mt-1">{myPosition.teamName}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-1">คะแนนรวม</p>
                <p className="text-3xl font-bold">{myPosition.totalPoints}</p>
                <p className="text-blue-200 mt-1">
                  GW: {myPosition.gameweekPoints} pts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนเฉลี่ย
              </p>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averagePoints}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                สูงสุด
              </p>
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.highestPoints}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ต่ำสุด
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.lowestPoints}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                GW เฉลี่ย
              </p>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averageGameweekPoints}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("standings")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "standings"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ตารางคะแนน
          </button>
          <button
            onClick={() => setSelectedTab("stats")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "stats"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            สถิติ
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ประวัติ
          </button>
          <button
            onClick={() => setSelectedTab("movers")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "movers"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ขึ้น-ลง
          </button>
        </div>

        {/* Standings Tab */}
        {selectedTab === "standings" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      อันดับ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      ทีม
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      GW
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      รวม
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {standings.map((standing, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        standing.teamId === MY_FANTASY_TEAM.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {standing.rank === 1 && (
                            <Crown className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="font-bold text-gray-900 dark:text-white">
                            {standing.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {standing.teamName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {standing.managerName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900 dark:text-white">
                          {standing.gameweekPoints}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {standing.totalPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {selectedTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                สถิติคะแนน
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    คะแนนเฉลี่ย
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.averagePoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    คะแนนสูงสุด
                  </span>
                  <span className="font-bold text-green-600">
                    {stats.highestPoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    คะแนนต่ำสุด
                  </span>
                  <span className="font-bold text-red-600">
                    {stats.lowestPoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    ส่วนต่าง
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.highestPoints - stats.lowestPoints}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                สถิติอื่นๆ
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    จำนวนผู้เล่น
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.totalManagers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    GW เฉลี่ย
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.averageGameweekPoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    ย้ายมากสุด
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.mostTransfers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    ย้ายน้อยสุด
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.leastTransfers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ประวัติ Gameweek
            </h3>
            <div className="space-y-4">
              {gameweekHistory.map((gw, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Gameweek {gw.gameweek}
                    </h4>
                    {myPosition && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        อันดับของคุณ: {gw.myRank}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        ทำคะแนนสูงสุด
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {gw.topScorer.teamName}
                      </p>
                      <p className="text-green-600 font-bold">
                        {gw.topScorer.points} pts
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        คะแนนเฉลี่ย
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {gw.averagePoints} pts
                      </p>
                    </div>
                    {myPosition && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          คะแนนของคุณ
                        </p>
                        <p className="font-bold text-blue-600">
                          {gw.myPoints} pts
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movers Tab */}
        {selectedTab === "movers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Risers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ขึ้นอันดับมากสุด
                </h3>
              </div>
              <div className="space-y-3">
                {topRisers.map((standing, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {standing.teamName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {standing.managerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="w-4 h-4" />
                          <span className="font-bold">
                            +{standing.rankChange}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          อันดับ {standing.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Fallers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ลงอันดับมากสุด
                </h3>
              </div>
              <div className="space-y-3">
                {topFallers.map((standing, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {standing.teamName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {standing.managerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-red-600">
                          <ArrowDown className="w-4 h-4" />
                          <span className="font-bold">{standing.rankChange}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          อันดับ {standing.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
