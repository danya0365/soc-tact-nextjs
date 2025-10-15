"use client";

import type { MyTeamViewModel } from "@/src/presentation/presenters/fantasy/MyTeamPresenter";
import {
  Award,
  BarChart3,
  Calendar,
  DollarSign,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface MyTeamViewProps {
  viewModel: MyTeamViewModel;
}

export default function MyTeamView({ viewModel }: MyTeamViewProps) {
  const {
    team,
    startingXI,
    bench,
    teamStats,
    formationAnalysis,
    upcomingFixtures,
  } = viewModel;

  // Group by position
  const gk = startingXI.filter((p) => p.player.position === "GK");
  const def = startingXI.filter((p) => p.player.position === "DEF");
  const mid = startingXI.filter((p) => p.player.position === "MID");
  const fwd = startingXI.filter((p) => p.player.position === "FWD");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {team.teamName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            รายละเอียดทีมและการวิเคราะห์
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                มูลค่าทีม
              </p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              £{teamStats.totalValue.toFixed(1)}m
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คะแนนเฉลี่ย
              </p>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {teamStats.averagePoints.toFixed(1)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                อายุเฉลี่ย
              </p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {teamStats.averageAge.toFixed(1)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ฟอร์เมชั่น
              </p>
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {team.formation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Team Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pitch */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                ทีมหลัก - {team.formation}
              </h2>

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
                        {item.player.name.split(" ").pop()}
                      </p>
                      <p className="text-xs text-green-200">{item.player.team}</p>
                      <p className="text-xs text-white/70 mt-1">
                        {item.player.totalPoints} pts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player Stats Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  สถิตินักเตะ
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        นักเตะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        คะแนน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        PPG
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        ฟอร์ม
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        ราคา
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {startingXI.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.player.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.player.team}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          {item.player.totalPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {item.player.pointsPerGame.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {item.player.form.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          £{item.player.price}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  นักเตะดีเด่น
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-1">
                    ทำคะแนนสูงสุด
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {teamStats.bestPerformer.name.split(" ").pop()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {teamStats.bestPerformer.totalPoints} คะแนน
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                    ราคาแพงที่สุด
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {teamStats.mostExpensivePlayer.name.split(" ").pop()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    £{teamStats.mostExpensivePlayer.price}m
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-1">
                    ต้องปรับปรุง
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {teamStats.worstPerformer.name.split(" ").pop()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {teamStats.worstPerformer.totalPoints} คะแนน
                  </p>
                </div>
              </div>
            </div>

            {/* Formation Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  การวิเคราะห์ฟอร์เมชั่น
                </h3>
              </div>
              <div className="space-y-4">
                {formationAnalysis.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      จุดแข็ง
                    </p>
                    <ul className="space-y-1">
                      {formationAnalysis.strengths.map((s, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {formationAnalysis.weaknesses.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      จุดอ่อน
                    </p>
                    <ul className="space-y-1">
                      {formationAnalysis.weaknesses.map((w, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          • {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Fixtures */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ตารางแข่ง 3 นัดถัดไป
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ง่าย
                  </span>
                  <span className="font-bold text-green-600">
                    {upcomingFixtures.easy} คน
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ปานกลาง
                  </span>
                  <span className="font-bold text-yellow-600">
                    {upcomingFixtures.medium} คน
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ยาก
                  </span>
                  <span className="font-bold text-red-600">
                    {upcomingFixtures.hard} คน
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Link
              href="/fantasy/squad"
              className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              แก้ไขทีม
            </Link>
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
  player: { name: string; team: string; totalPoints: number; form: number };
  isCaptain: boolean;
  isViceCaptain: boolean;
}) {
  return (
    <div className="relative group">
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
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-2"></div>
        <p className="text-xs font-bold text-gray-900 text-center truncate">
          {player.name.split(" ").pop()}
        </p>
        <p className="text-xs text-gray-600 text-center">{player.team}</p>
        <div className="mt-2 bg-green-100 rounded px-2 py-1 text-center">
          <p className="text-xs font-bold text-green-800">{player.totalPoints}</p>
        </div>
        <div className="mt-1 text-center">
          <p className="text-xs text-gray-500">ฟอร์ม: {player.form.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
