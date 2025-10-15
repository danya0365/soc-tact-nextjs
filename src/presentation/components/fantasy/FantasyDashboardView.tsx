"use client";

import type { FantasyDashboardViewModel } from "@/src/presentation/presenters/fantasy/FantasyDashboardPresenter";
import {
  ArrowRight,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface FantasyDashboardViewProps {
  viewModel: FantasyDashboardViewModel;
}

export default function FantasyDashboardView({
  viewModel,
}: FantasyDashboardViewProps) {
  const {
    team,
    currentGameweek,
    startingXI,
    bench,
    myLeagues,
    stats,
    deadlineInfo,
  } = viewModel;

  // Group players by position for formation display
  const groupByPosition = () => {
    const gk = startingXI.filter((p) => p.player.position === "GK");
    const def = startingXI.filter((p) => p.player.position === "DEF");
    const mid = startingXI.filter((p) => p.player.position === "MID");
    const fwd = startingXI.filter((p) => p.player.position === "FWD");

    return { gk, def, mid, fwd };
  };

  const { gk, def, mid, fwd } = groupByPosition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {team.teamName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            จัดการโดย {team.managerName}
          </p>
        </div>

        {/* Deadline Warning */}
        {deadlineInfo && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              deadlineInfo.isUrgent
                ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                : "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock
                className={`w-5 h-5 ${
                  deadlineInfo.isUrgent ? "text-red-600" : "text-yellow-600"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    deadlineInfo.isUrgent
                      ? "text-red-900 dark:text-red-200"
                      : "text-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {deadlineInfo.isUrgent ? "⚠️ ใกล้ปิดรับทีม!" : "เวลาที่เหลือ"}
                </p>
                <p
                  className={`text-sm ${
                    deadlineInfo.isUrgent
                      ? "text-red-700 dark:text-red-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  เหลือเวลาอีก {deadlineInfo.hoursRemaining} ชั่วโมง
                  ก่อนปิดรับทีม {currentGameweek?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนรวม
              </p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalPoints.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              GW: {stats.gameweekPoints} คะแนน
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                อันดับโลก
              </p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.overallRank.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ↑ ขึ้น 84,153 อันดับ
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                มูลค่าทีม
              </p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              £{stats.teamValue}m
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              เงินคงเหลือ: £{stats.bank}m
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ย้ายฟรี
              </p>
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.freeTransfers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              สิทธิ์ย้ายนักเตะ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Team Display */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    ทีมของคุณ
                  </h2>
                  <p className="text-green-100">
                    แบบฟอร์เมชั่น {team.formation}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/fantasy/my-team"
                    className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
                  >
                    ดูรายละเอียด
                  </Link>
                  <Link
                    href="/fantasy/squad"
                    className="px-4 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    แก้ไขทีม
                  </Link>
                </div>
              </div>

              {/* Football Pitch */}
              <div className="relative bg-green-700/50 rounded-lg p-8 min-h-[500px]">
                {/* Pitch Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                </div>

                {/* Players */}
                <div className="relative space-y-12">
                  {/* Forwards */}
                  <div className="flex justify-center gap-4">
                    {fwd.map((item, idx) => (
                      <PlayerCard key={idx} {...item} />
                    ))}
                  </div>

                  {/* Midfielders */}
                  <div className="flex justify-center gap-4">
                    {mid.map((item, idx) => (
                      <PlayerCard key={idx} {...item} />
                    ))}
                  </div>

                  {/* Defenders */}
                  <div className="flex justify-center gap-4">
                    {def.map((item, idx) => (
                      <PlayerCard key={idx} {...item} />
                    ))}
                  </div>

                  {/* Goalkeeper */}
                  <div className="flex justify-center">
                    {gk.map((item, idx) => (
                      <PlayerCard key={idx} {...item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bench */}
              <div className="mt-6 bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">สำรอง</h3>
                <div className="grid grid-cols-4 gap-3">
                  {bench.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/20 rounded-lg p-3 text-center"
                    >
                      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-white font-medium truncate">
                        {item.player.name}
                      </p>
                      <p className="text-xs text-green-200">
                        {item.player.team}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                การดำเนินการ
              </h3>
              <div className="space-y-3">
                <Link
                  href="/fantasy/transfers"
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <span className="text-blue-900 dark:text-blue-200 font-medium">
                    ซื้อ-ขายนักเตะ
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                <Link
                  href="/fantasy/fixtures"
                  className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <span className="text-purple-900 dark:text-purple-200 font-medium">
                    ตารางแข่งขัน
                  </span>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </Link>
                <Link
                  href="/fantasy/points"
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <span className="text-green-900 dark:text-green-200 font-medium">
                    คะแนนและสถิติ
                  </span>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </Link>
                <Link
                  href="/fantasy/rules"
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <span className="text-orange-900 dark:text-orange-200 font-medium">
                    กฎและวิธีเล่น
                  </span>
                  <ArrowRight className="w-5 h-5 text-orange-600" />
                </Link>
                <Link
                  href="/fantasy/dream-team"
                  className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <span className="text-indigo-900 dark:text-indigo-200 font-medium">
                    สร้างทีมอัตโนมัติ
                  </span>
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                </Link>
                <Link
                  href="/fantasy/captain-picker"
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <span className="text-yellow-900 dark:text-yellow-200 font-medium">
                    เลือกกัปตัน & Differential
                  </span>
                  <ArrowRight className="w-5 h-5 text-yellow-600" />
                </Link>
                <Link
                  href="/fantasy/head-to-head"
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <span className="text-red-900 dark:text-red-200 font-medium">
                    เปรียบเทียบทีม
                  </span>
                  <ArrowRight className="w-5 h-5 text-red-600" />
                </Link>
                <Link
                  href="/fantasy/planner"
                  className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                >
                  <span className="text-teal-900 dark:text-teal-200 font-medium">
                    วางแผน Gameweek
                  </span>
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                </Link>
                <Link
                  href="/fantasy/watchlist"
                  className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                >
                  <span className="text-pink-900 dark:text-pink-200 font-medium">
                    Watchlist & ราคา
                  </span>
                  <ArrowRight className="w-5 h-5 text-pink-600" />
                </Link>
              </div>
            </div>

            {/* My Leagues */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ลีกของฉัน
                </h3>
                <Link
                  href="/fantasy/leagues"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ดูทั้งหมด
                </Link>
              </div>
              <div className="space-y-3">
                {myLeagues.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.league.name}
                      </p>
                      {item.myRank && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          #{item.myRank.rank}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.league.totalManagers.toLocaleString()} ผู้เล่น
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gameweek Info */}
            {currentGameweek && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 shadow-md text-white">
                <h3 className="text-lg font-bold mb-2">
                  {currentGameweek.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">คะแนนเฉลี่ย:</span>
                    <span className="font-semibold">
                      {currentGameweek.averageScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">คะแนนสูงสุด:</span>
                    <span className="font-semibold">
                      {currentGameweek.highestScore}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Player Card Component
function PlayerCard({
  player,
  isCaptain,
  isViceCaptain,
}: {
  player: { name: string; team: string; totalPoints: number };
  isCaptain: boolean;
  isViceCaptain: boolean;
}) {
  return (
    <div className="relative group">
      {/* Captain Badge */}
      {isCaptain && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-lg">
          C
        </div>
      )}
      {isViceCaptain && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-lg">
          V
        </div>
      )}

      <div className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-24">
        {/* Player Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-2"></div>

        {/* Player Info */}
        <p className="text-xs font-bold text-gray-900 text-center truncate">
          {player.name.split(" ").pop()}
        </p>
        <p className="text-xs text-gray-600 text-center">{player.team}</p>

        {/* Points */}
        <div className="mt-2 bg-green-100 rounded px-2 py-1 text-center">
          <p className="text-xs font-bold text-green-800">
            {player.totalPoints}
          </p>
        </div>
      </div>
    </div>
  );
}
