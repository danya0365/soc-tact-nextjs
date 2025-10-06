"use client";

import type { CaptainPickerViewModel } from "@/src/presentation/presenters/fantasy/CaptainPickerPresenter";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface CaptainPickerViewProps {
  viewModel: CaptainPickerViewModel;
}

export default function CaptainPickerView({
  viewModel,
}: CaptainPickerViewProps) {
  const {
    currentGameweek,
    topCaptainPicks,
    safeCaptains,
    differentialCaptains,
    differentialPlayers,
    lowOwnershipGems,
    templatePlayers,
  } = viewModel;

  const [selectedTab, setSelectedTab] = useState<"captain" | "differential">(
    "captain"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Captain Picker & Differentials
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            เลือกกัปตันและหานักเตะที่คนอื่นไม่เลือก
          </p>
          {currentGameweek && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {currentGameweek.name} - Deadline:{" "}
              {new Date(currentGameweek.deadline).toLocaleString("th-TH")}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedTab("captain")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedTab === "captain"
                ? "bg-yellow-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <Crown className="w-5 h-5 inline-block mr-2" />
            Captain Picker
          </button>
          <button
            onClick={() => setSelectedTab("differential")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedTab === "differential"
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <Sparkles className="w-5 h-5 inline-block mr-2" />
            Differential Finder
          </button>
        </div>

        {/* Captain Picker Tab */}
        {selectedTab === "captain" && (
          <div className="space-y-8">
            {/* Top Captain Picks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  กัปตันแนะนำ Top 5
                </h2>
              </div>

              <div className="space-y-4">
                {topCaptainPicks.map((captain, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {captain.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {captain.team} • {captain.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">
                          {captain.captainScore.toFixed(0)}
                        </div>
                        <p className="text-xs text-gray-500">คะแนนกัปตัน</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          ฟอร์ม: {captain.form.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          คาดการณ์: {captain.expectedPoints} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          เจ้าของ: {captain.ownership.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {captain.reasons.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          จุดแข็ง:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {captain.reasons.map((reason, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {captain.risks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          ความเสี่ยง:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {captain.risks.map((risk, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded"
                            >
                              {risk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safe vs Differential */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Safe Captains */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    กัปตันปลอดภัย
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  คนเลือกเยอะ ฟอร์มดี เสี่ยงน้อย
                </p>
                <div className="space-y-3">
                  {safeCaptains.slice(0, 3).map((captain, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {captain.name.split(" ").pop()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {captain.team} • {captain.ownership.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {captain.expectedPoints}
                          </p>
                          <p className="text-xs text-gray-500">pts</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differential Captains */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    กัปตันเสี่ยง
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  คนเลือกน้อย แต่มีโอกาสทำคะแนนสูง
                </p>
                <div className="space-y-3">
                  {differentialCaptains.slice(0, 3).map((captain, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {captain.name.split(" ").pop()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {captain.team} • {captain.ownership.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">
                            {captain.expectedPoints}
                          </p>
                          <p className="text-xs text-gray-500">pts</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Differential Finder Tab */}
        {selectedTab === "differential" && (
          <div className="space-y-8">
            {/* Differential Players */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  นักเตะ Differential แนะนำ
                </h2>
              </div>

              <div className="space-y-4">
                {differentialPlayers.map((player, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {player.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {player.team} • {player.position} • £{player.price}m
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {player.differentialScore.toFixed(0)}
                        </div>
                        <p className="text-xs text-gray-500">Diff Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          เจ้าของ: {player.ownership.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          ฟอร์ม: {player.form.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          คะแนน: {player.totalPoints}
                        </span>
                      </div>
                    </div>

                    {player.upside.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                          ข้อดี:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {player.upside.map((up, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded"
                            >
                              {up}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {player.downside.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                          ข้อเสีย:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {player.downside.map((down, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded"
                            >
                              {down}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Low Ownership Gems vs Template */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Ownership Gems */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Hidden Gems (&lt;5%)
                  </h3>
                </div>
                <div className="space-y-3">
                  {lowOwnershipGems.map((player, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {player.name.split(" ").pop()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {player.team} • {player.ownership.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-600">
                            {player.form.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500">form</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Players */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Template (คนเลือกเยอะ)
                  </h3>
                </div>
                <div className="space-y-3">
                  {templatePlayers.slice(0, 5).map((player, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {player.name.split(" ").pop()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {player.team}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            {player.ownership.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">owned</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
