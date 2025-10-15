"use client";

import type { LeaguesViewModel } from "@/src/presentation/presenters/fantasy/LeaguesPresenter";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Plus,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LeaguesViewProps {
  viewModel: LeaguesViewModel;
}

export default function LeaguesView({ viewModel }: LeaguesViewProps) {
  const { myLeagues, myTeamId } = viewModel;

  const [expandedLeague, setExpandedLeague] = useState<string | null>(
    myLeagues[0]?.league.id || null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const toggleLeague = (leagueId: string) => {
    setExpandedLeague(expandedLeague === leagueId ? null : leagueId);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      );
    if (rank === 2)
      return <Crown className="w-5 h-5 text-gray-400 fill-gray-400" />;
    if (rank === 3)
      return <Crown className="w-5 h-5 text-orange-600 fill-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ลีกของฉัน
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            แข่งขันกับเพื่อนและผู้เล่นทั่วโลก
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            สร้างลีกใหม่
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            เข้าร่วมลีก
          </button>
        </div>

        {/* My Leagues */}
        <div className="space-y-4">
          {myLeagues.map((item) => (
            <div
              key={item.league.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* League Header */}
              <button
                onClick={() => toggleLeague(item.league.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.league.type === "global"
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}
                  >
                    {item.league.type === "global" ? (
                      <Trophy className="w-6 h-6 text-white" />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.league.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.league.totalManagers.toLocaleString()} ผู้เล่น
                      {item.league.code && ` • รหัส: ${item.league.code}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.myRank && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        อันดับของคุณ
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        #{item.myRank.rank.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {expandedLeague === item.league.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* League Standings */}
              {expandedLeague === item.league.id && (
                <div className="border-t border-gray-200 dark:border-gray-700">
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            ผู้จัดการ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            GW
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            คะแนนรวม
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {item.standings.map((standing) => (
                          <tr
                            key={standing.teamId}
                            className={`${
                              standing.teamId === myTeamId
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getRankBadge(standing.rank)}
                                <span
                                  className={`text-sm font-semibold ${
                                    standing.teamId === myTeamId
                                      ? "text-green-600"
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {standing.rank}
                                </span>
                                {standing.rank < standing.lastRank && (
                                  <ChevronUp className="w-4 h-4 text-green-600" />
                                )}
                                {standing.rank > standing.lastRank && (
                                  <ChevronDown className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p
                                className={`font-medium ${
                                  standing.teamId === myTeamId
                                    ? "text-green-600 font-semibold"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {standing.teamName}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {standing.managerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {standing.gameweekPoints}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                              {standing.totalPoints.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create League Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                สร้างลีกใหม่
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ชื่อลีก
                  </label>
                  <input
                    type="text"
                    placeholder="ลีกของฉัน"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    คำอธิบาย (ไม่บังคับ)
                  </label>
                  <textarea
                    placeholder="อธิบายเกี่ยวกับลีก..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  สร้างลีก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join League Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                เข้าร่วมลีก
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    รหัสลีก
                  </label>
                  <input
                    type="text"
                    placeholder="กรอกรหัสลีก"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ขอรหัสลีกจากผู้สร้างลีกเพื่อเข้าร่วม
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  เข้าร่วม
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
