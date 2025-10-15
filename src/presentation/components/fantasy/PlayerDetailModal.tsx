"use client";

import type { FantasyPlayer } from "@/src/data/mock/fantasy/players.mock";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

interface PlayerDetailModalProps {
  player: FantasyPlayer;
  isOpen: boolean;
  onClose: () => void;
  onAddToSquad?: () => void;
}

export default function PlayerDetailModal({
  player,
  isOpen,
  onClose,
  onAddToSquad,
}: PlayerDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState<"stats" | "fixtures" | "form">(
    "stats"
  );

  if (!isOpen) return null;

  // Calculate stats
  const pointsPerGame = player.minutesPlayed > 0 
    ? (player.totalPoints / (player.minutesPlayed / 90)).toFixed(1) 
    : "0.0";
  const priceChangeIcon = player.priceChange > 0 ? <ArrowUp className="w-4 h-4" /> : player.priceChange < 0 ? <ArrowDown className="w-4 h-4" /> : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start gap-6">
            {/* Player Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex-shrink-0"></div>

            {/* Player Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {player.name}
              </h2>
              <div className="flex items-center gap-4 text-white/90">
                <span className="text-lg">{player.team}</span>
                <span>•</span>
                <span className="text-lg">{player.position}</span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <p className="text-white/70 text-sm">ราคา</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-white">
                      £{player.price}m
                    </p>
                    {priceChangeIcon && (
                      <span
                        className={`flex items-center text-sm ${
                          player.priceChange > 0
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {priceChangeIcon}
                        {Math.abs(player.priceChange).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-white/70 text-sm">เจ้าของ</p>
                  <p className="text-2xl font-bold text-white">
                    {player.ownership.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">คะแนนรวม</p>
                  <p className="text-2xl font-bold text-white">
                    {player.totalPoints}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setSelectedTab("stats")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                selectedTab === "stats"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              สถิติ
            </button>
            <button
              onClick={() => setSelectedTab("fixtures")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                selectedTab === "fixtures"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              ตารางแข่ง
            </button>
            <button
              onClick={() => setSelectedTab("form")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                selectedTab === "form"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              ฟอร์ม
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {selectedTab === "stats" && (
            <div className="space-y-6">
              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  สถิติการเล่น
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="คะแนน/เกม"
                    value={pointsPerGame}
                    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                  />
                  <StatCard
                    label="ประตู"
                    value={player.goalsScored}
                    icon="⚽"
                  />
                  <StatCard
                    label="แอสซิสต์"
                    value={player.assists}
                    icon="🎯"
                  />
                  <StatCard
                    label="คลีนชีท"
                    value={player.cleanSheets}
                    icon="🛡️"
                  />
                  <StatCard
                    label="นาทีที่เล่น"
                    value={player.minutesPlayed.toLocaleString()}
                    icon="⏱️"
                  />
                  <StatCard
                    label="โบนัส"
                    value={player.bonusPoints}
                    icon="⭐"
                  />
                  <StatCard
                    label="ฟอร์ม"
                    value={player.form.toFixed(1)}
                    icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                  />
                  <StatCard
                    label="เกมที่เล่น"
                    value={Math.floor(player.minutesPlayed / 90)}
                    icon="📊"
                  />
                </div>
              </div>

              {/* Points Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  การทำคะแนน
                </h3>
                <div className="space-y-3">
                  <PointsBreakdownRow
                    label="ประตู"
                    points={player.goalsScored * (player.position === "FWD" ? 4 : player.position === "MID" ? 5 : 6)}
                    detail={`${player.goalsScored} ประตู`}
                  />
                  <PointsBreakdownRow
                    label="แอสซิสต์"
                    points={player.assists * 3}
                    detail={`${player.assists} ครั้ง`}
                  />
                  <PointsBreakdownRow
                    label="คลีนชีท"
                    points={player.cleanSheets * (player.position === "GK" || player.position === "DEF" ? 4 : 1)}
                    detail={`${player.cleanSheets} ครั้ง`}
                  />
                  <PointsBreakdownRow
                    label="โบนัส"
                    points={player.bonusPoints}
                    detail={`${player.bonusPoints} คะแนน`}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTab === "fixtures" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                5 นัดถัดไป
              </h3>
              {player.nextFixtures.map((fixture, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        fixture.difficulty <= 2
                          ? "bg-green-100 dark:bg-green-900/30"
                          : fixture.difficulty <= 3
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : fixture.difficulty <= 4
                              ? "bg-orange-100 dark:bg-orange-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      <span className="text-2xl">
                        {fixture.isHome ? "🏠" : "✈️"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {fixture.isHome ? "vs" : "@"} {fixture.opponent}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gameweek {idx + 10}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        fixture.difficulty <= 2
                          ? "text-green-600"
                          : fixture.difficulty <= 3
                            ? "text-yellow-600"
                            : fixture.difficulty <= 4
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {fixture.difficulty <= 2
                        ? "ง่าย"
                        : fixture.difficulty <= 3
                          ? "ปานกลาง"
                          : fixture.difficulty <= 4
                            ? "ยาก"
                            : "ยากมาก"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      FDR: {fixture.difficulty}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "form" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                ฟอร์ม 5 เกมล่าสุด
              </h3>

              {/* Form Chart */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="flex items-end justify-between gap-2 h-48">
                  {player.lastFiveGames.map((points, idx) => {
                    const maxPoints = Math.max(...player.lastFiveGames);
                    const height = (points / maxPoints) * 100;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {points}
                        </div>
                        <div
                          className={`w-full rounded-t transition-all ${
                            points >= 8
                              ? "bg-green-500"
                              : points >= 5
                                ? "bg-blue-500"
                                : points >= 2
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ height: `${Math.max(height, 10)}%` }}
                        ></div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          GW{idx + 5}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-1">
                    เฉลี่ย 5 เกม
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {player.form.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                    สูงสุด
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.max(...player.lastFiveGames)}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200 mb-1">
                    ต่ำสุด
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.min(...player.lastFiveGames)}
                  </p>
                </div>
              </div>

              {/* Form Trend */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {player.form >= 7 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : player.form >= 5 ? (
                    <ChevronRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {player.form >= 7
                        ? "ฟอร์มดีมาก"
                        : player.form >= 5
                          ? "ฟอร์มปานกลาง"
                          : "ฟอร์มแย่"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {player.form >= 7
                        ? "แนะนำให้เลือก"
                        : player.form >= 5
                          ? "พิจารณาก่อนเลือก"
                          : "ไม่แนะนำ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {onAddToSquad && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onAddToSquad}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              เพิ่มลงทีม - £{player.price}m
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {typeof icon === "string" ? (
          <span className="text-xl">{icon}</span>
        ) : (
          icon
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function PointsBreakdownRow({
  label,
  points,
  detail,
}: {
  label: string;
  points: number;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{detail}</p>
      </div>
      <p className="text-lg font-bold text-green-600">+{points}</p>
    </div>
  );
}
