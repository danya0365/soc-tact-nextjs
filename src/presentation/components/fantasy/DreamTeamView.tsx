"use client";

import type {
  BuildStrategy,
  DreamTeamConstraints,
  DreamTeamViewModel,
  GeneratedTeam,
} from "@/src/presentation/presenters/fantasy/DreamTeamPresenter";
import { DreamTeamPresenter } from "@/src/presentation/presenters/fantasy/DreamTeamPresenter";
import {
  BarChart3,
  DollarSign,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface DreamTeamViewProps {
  viewModel: DreamTeamViewModel;
}

export default function DreamTeamView({ viewModel }: DreamTeamViewProps) {
  const {
    formations,
    strategies,
    defaultConstraints,
    topPlayersByPoints,
  } = viewModel;

  const [constraints, setConstraints] =
    useState<DreamTeamConstraints>(defaultConstraints);
  const [generatedTeam, setGeneratedTeam] = useState<GeneratedTeam | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const presenter = new DreamTeamPresenter();
      const team = presenter.generateDreamTeam(constraints);
      setGeneratedTeam(team);
      setIsGenerating(false);
    }, 500);
  };

  const handleReset = () => {
    setConstraints(defaultConstraints);
    setGeneratedTeam(null);
  };

  // Group players by position
  const groupByPosition = (players: GeneratedTeam["players"]) => {
    const gk = players.filter((p) => p.position === "GK").slice(0, 1);
    const [defCount, midCount, fwdCount] = constraints.formation
      .split("-")
      .map(Number);

    const def = players.filter((p) => p.position === "DEF").slice(0, defCount);
    const mid = players.filter((p) => p.position === "MID").slice(0, midCount);
    const fwd = players.filter((p) => p.position === "FWD").slice(0, fwdCount);

    const bench = [
      ...players.filter((p) => p.position === "GK").slice(1),
      ...players.filter((p) => p.position === "DEF").slice(defCount),
      ...players.filter((p) => p.position === "MID").slice(midCount),
      ...players.filter((p) => p.position === "FWD").slice(fwdCount),
    ].slice(0, 4);

    return { gk, def, mid, fwd, bench };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dream Team Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            สร้างทีมในฝันอัตโนมัติด้วย AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ตั้งค่าทีม
                </h2>
              </div>

              <div className="space-y-4">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    งบประมาณ: £{constraints.budget}m
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="100"
                    step="5"
                    value={constraints.budget}
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        budget: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                {/* Formation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ฟอร์เมชั่น
                  </label>
                  <select
                    value={constraints.formation}
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        formation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {formations.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strategy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    กลยุทธ์
                  </label>
                  <div className="space-y-2">
                    {strategies.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="strategy"
                          value={s.id}
                          checked={constraints.strategy === s.id}
                          onChange={(e) =>
                            setConstraints({
                              ...constraints,
                              strategy: e.target.value as BuildStrategy,
                            })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {s.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={constraints.prioritizeForm}
                      onChange={(e) =>
                        setConstraints({
                          ...constraints,
                          prioritizeForm: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      เน้นฟอร์มดี
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={constraints.prioritizeFixtures}
                      onChange={(e) =>
                        setConstraints({
                          ...constraints,
                          prioritizeFixtures: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      เน้นตารางแข่งง่าย
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      กำลังสร้าง...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      สร้างทีมในฝัน
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  รีเซ็ต
                </button>
              </div>
            </div>

            {/* Top Players Reference */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                นักเตะแนะนำ
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    คะแนนสูงสุด
                  </p>
                  <div className="space-y-1">
                    {topPlayersByPoints.slice(0, 3).map((p, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 dark:text-gray-400 flex justify-between"
                      >
                        <span>{p.name.split(" ").pop()}</span>
                        <span>{p.totalPoints} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Team Display */}
          <div className="lg:col-span-2">
            {!generatedTeam ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md border border-gray-200 dark:border-gray-700 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  พร้อมสร้างทีมในฝัน?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ตั้งค่าทีมและกดปุ่ม &quot;สร้างทีมในฝัน&quot; เพื่อเริ่มต้น
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Team Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ใช้งบ
                      </p>
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      £{generatedTeam.totalCost.toFixed(1)}m
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        คาดการณ์
                      </p>
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {generatedTeam.projectedPoints}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        คุ้มค่า
                      </p>
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {generatedTeam.valueRating}%
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        เหลือ
                      </p>
                      <DollarSign className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      £{generatedTeam.remainingBudget.toFixed(1)}m
                    </p>
                  </div>
                </div>

                {/* Team Display */}
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    ทีมที่แนะนำ - {generatedTeam.formation}
                  </h2>

                  <div className="relative bg-green-700/50 rounded-lg p-8 min-h-[400px]">
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
                    </div>

                    {(() => {
                      const { gk, def, mid, fwd, bench } = groupByPosition(
                        generatedTeam.players
                      );
                      return (
                        <>
                          <div className="relative space-y-10">
                            <div className="flex justify-center gap-3">
                              {fwd.map((p, idx) => (
                                <PlayerCard key={idx} player={p} />
                              ))}
                            </div>
                            <div className="flex justify-center gap-3">
                              {mid.map((p, idx) => (
                                <PlayerCard key={idx} player={p} />
                              ))}
                            </div>
                            <div className="flex justify-center gap-3">
                              {def.map((p, idx) => (
                                <PlayerCard key={idx} player={p} />
                              ))}
                            </div>
                            <div className="flex justify-center">
                              {gk.map((p, idx) => (
                                <PlayerCard key={idx} player={p} />
                              ))}
                            </div>
                          </div>

                          {/* Bench */}
                          <div className="mt-6 bg-white/10 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3">
                              สำรอง
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                              {bench.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/20 rounded-lg p-2 text-center"
                                >
                                  <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto mb-1"></div>
                                  <p className="text-xs text-white font-medium truncate">
                                    {p.name.split(" ").pop()}
                                  </p>
                                  <p className="text-xs text-green-200">
                                    £{p.price}m
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Team Balance */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    สมดุลของทีม
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          โจมตี
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {generatedTeam.teamBalance.attack}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{
                            width: `${generatedTeam.teamBalance.attack}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          กลาง
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {generatedTeam.teamBalance.midfield}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${generatedTeam.teamBalance.midfield}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          ป้องกัน
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {generatedTeam.teamBalance.defense}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${generatedTeam.teamBalance.defense}%`,
                          }}
                        ></div>
                      </div>
                    </div>
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
function PlayerCard({ player }: { player: { name: string; team: string; price: number } }) {
  return (
    <div className="bg-white rounded-lg p-2 shadow-lg w-20">
      <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-1"></div>
      <p className="text-xs font-bold text-gray-900 text-center truncate">
        {player.name.split(" ").pop()}
      </p>
      <p className="text-xs text-gray-600 text-center">{player.team}</p>
      <div className="mt-1 bg-green-100 rounded px-1 py-0.5 text-center">
        <p className="text-xs font-bold text-green-800">£{player.price}m</p>
      </div>
    </div>
  );
}
