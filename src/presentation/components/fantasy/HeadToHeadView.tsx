"use client";

import type {
  HeadToHeadViewModel,
  TeamComparison,
} from "@/src/presentation/presenters/fantasy/HeadToHeadPresenter";
import { HeadToHeadPresenter } from "@/src/presentation/presenters/fantasy/HeadToHeadPresenter";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  DollarSign,
  Minus,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface HeadToHeadViewProps {
  viewModel: HeadToHeadViewModel;
}

export default function HeadToHeadView({ viewModel }: HeadToHeadViewProps) {
  const { availableOpponents } = viewModel;
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>("");
  const [comparison, setComparison] = useState<TeamComparison | null>(null);

  const handleCompare = () => {
    if (!selectedOpponentId) return;
    const presenter = new HeadToHeadPresenter();
    const result = presenter.compareTeams(selectedOpponentId);
    setComparison(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Head-to-Head Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            เปรียบเทียบทีมของคุณกับคู่แข่ง
          </p>
        </div>

        {/* Opponent Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            เลือกคู่แข่ง
          </h2>
          <div className="flex gap-4">
            <select
              value={selectedOpponentId}
              onChange={(e) => setSelectedOpponentId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">-- เลือกทีมคู่แข่ง --</option>
              {availableOpponents.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName} ({team.managerName})
                </option>
              ))}
            </select>
            <button
              onClick={handleCompare}
              disabled={!selectedOpponentId}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              เปรียบเทียบ
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-8">
            {/* Team Headers */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">ทีมของคุณ</h3>
                </div>
                <p className="text-blue-100">{comparison.myTeam.teamName}</p>
                <p className="text-sm text-blue-200">{comparison.myTeam.managerName}</p>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">คู่แข่ง</h3>
                </div>
                <p className="text-red-100">{comparison.opponentTeam.teamName}</p>
                <p className="text-sm text-red-200">{comparison.opponentTeam.managerName}</p>
              </div>
            </div>

            {/* Stats Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                เปรียบเทียบสถิติ
              </h3>
              <div className="space-y-6">
                <ComparisonRow
                  label="คะแนนรวม"
                  icon={<Award className="w-5 h-5 text-yellow-600" />}
                  myValue={comparison.comparison.totalPoints.mine}
                  opponentValue={comparison.comparison.totalPoints.opponent}
                  difference={comparison.comparison.totalPoints.difference}
                />
                <ComparisonRow
                  label="มูลค่าทีม"
                  icon={<DollarSign className="w-5 h-5 text-green-600" />}
                  myValue={`£${comparison.comparison.teamValue.mine.toFixed(1)}m`}
                  opponentValue={`£${comparison.comparison.teamValue.opponent.toFixed(1)}m`}
                  difference={comparison.comparison.teamValue.difference}
                  lowerIsBetter
                />
                <ComparisonRow
                  label="คะแนนเฉลี่ย"
                  icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                  myValue={comparison.comparison.averagePoints.mine.toFixed(1)}
                  opponentValue={comparison.comparison.averagePoints.opponent.toFixed(1)}
                  difference={comparison.comparison.averagePoints.difference}
                />
                <ComparisonRow
                  label="ฟอร์มเฉลี่ย"
                  icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                  myValue={comparison.comparison.formScore.mine.toFixed(1)}
                  opponentValue={comparison.comparison.formScore.opponent.toFixed(1)}
                  difference={comparison.comparison.formScore.difference}
                />
              </div>
            </div>

            {/* Player Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                เปรียบเทียบนักเตะ
              </h3>
              <div className="space-y-4">
                {comparison.playerComparison.map((comp, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      comp.advantage === "mine"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : comp.advantage === "opponent"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* My Player */}
                      <div className="text-left">
                        {comp.myPlayer ? (
                          <>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {comp.myPlayer.name.split(" ").pop()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {comp.myPlayer.team} • {comp.myPlayer.totalPoints} pts
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-400">-</p>
                        )}
                      </div>

                      {/* Position */}
                      <div className="text-center">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                          {comp.position}
                        </span>
                      </div>

                      {/* Opponent Player */}
                      <div className="text-right">
                        {comp.opponentPlayer ? (
                          <>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {comp.opponentPlayer.name.split(" ").pop()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {comp.opponentPlayer.team} • {comp.opponentPlayer.totalPoints} pts
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-400">-</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages & Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Advantages/Disadvantages */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  จุดแข็ง/จุดอ่อน
                </h3>
                <div className="space-y-4">
                  {comparison.advantages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        จุดแข็ง:
                      </p>
                      <ul className="space-y-1">
                        {comparison.advantages.map((adv, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4 text-green-600" />
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {comparison.disadvantages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                        จุดอ่อน:
                      </p>
                      <ul className="space-y-1">
                        {comparison.disadvantages.map((dis, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                          >
                            <ArrowDown className="w-4 h-4 text-red-600" />
                            {dis}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Prediction */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6" />
                  <h3 className="text-lg font-bold">การทำนาย</h3>
                </div>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold mb-2">
                    {comparison.prediction.winner === "mine"
                      ? "คุณน่าจะชนะ"
                      : comparison.prediction.winner === "opponent"
                        ? "คู่แข่งน่าจะชนะ"
                        : "เสมอกัน"}
                  </p>
                  <p className="text-purple-200">
                    ความมั่นใจ: {comparison.prediction.confidence}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-100 font-medium">เหตุผล:</p>
                  {comparison.prediction.reasoning.map((reason, idx) => (
                    <p key={idx} className="text-sm text-purple-200">
                      • {reason}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!comparison && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              เลือกคู่แข่งเพื่อเปรียบเทียบ
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              เลือกทีมจากรายการด้านบนแล้วกดปุ่มเปรียบเทียบ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Comparison Row Component
function ComparisonRow({
  label,
  icon,
  myValue,
  opponentValue,
  difference,
  lowerIsBetter = false,
}: {
  label: string;
  icon: React.ReactNode;
  myValue: string | number;
  opponentValue: string | number;
  difference: number;
  lowerIsBetter?: boolean;
}) {
  const isAdvantage = lowerIsBetter ? difference < 0 : difference > 0;
  const isEqual = Math.abs(difference) < 0.1;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">{myValue}</p>
          <p className="text-xs text-gray-500">คุณ</p>
        </div>
        <div className="flex items-center">
          {isEqual ? (
            <Minus className="w-5 h-5 text-gray-400" />
          ) : isAdvantage ? (
            <ArrowUp className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowDown className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-red-600">{opponentValue}</p>
          <p className="text-xs text-gray-500">คู่แข่ง</p>
        </div>
      </div>
    </div>
  );
}
