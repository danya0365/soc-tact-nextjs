"use client";

import type { TransfersViewModel } from "@/src/presentation/presenters/fantasy/TransfersPresenter";
import {
  AlertCircle,
  ArrowDownUp,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface TransfersViewProps {
  viewModel: TransfersViewModel;
}

export default function TransfersView({ viewModel }: TransfersViewProps) {
  const {
    team,
    currentSquad,
    transferInfo,
    chips,
    suggestedTransfers,
    allPlayers,
  } = viewModel;

  const [transfersOut, setTransfersOut] = useState<string[]>([]);
  const [transfersIn, setTransfersIn] = useState<string[]>([]);
  const [wildcardActive, setWildcardActive] = useState(false);

  const transferCount = transfersOut.length;
  const pointsDeduction =
    transferCount > transferInfo.freeTransfers
      ? (transferCount - transferInfo.freeTransfers) * transferInfo.transferCost
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ซื้อ-ขายนักเตะ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ปรับปรุงทีมของคุณก่อนถึง Deadline
          </p>
        </div>

        {/* Deadline Warning */}
        {transferInfo.hoursRemaining > 0 && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              transferInfo.hoursRemaining < 24
                ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                : "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock
                className={`w-5 h-5 ${
                  transferInfo.hoursRemaining < 24
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    transferInfo.hoursRemaining < 24
                      ? "text-red-900 dark:text-red-200"
                      : "text-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {transferInfo.hoursRemaining < 24
                    ? "⚠️ ใกล้ปิดรับทีม!"
                    : "เวลาที่เหลือ"}
                </p>
                <p
                  className={`text-sm ${
                    transferInfo.hoursRemaining < 24
                      ? "text-red-700 dark:text-red-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  เหลือเวลาอีก {transferInfo.hoursRemaining} ชั่วโมง
                  ก่อนปิดรับทีม
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              สิทธิ์ย้ายฟรี
            </p>
            <p className="text-3xl font-bold text-green-600">
              {transferInfo.freeTransfers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              การย้ายที่ทำ
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {transferCount}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              หักคะแนน
            </p>
            <p
              className={`text-3xl font-bold ${
                pointsDeduction > 0 ? "text-red-600" : "text-gray-900 dark:text-white"
              }`}
            >
              -{pointsDeduction}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              เงินคงเหลือ
            </p>
            <p className="text-3xl font-bold text-green-600">
              £{team.bank.toFixed(1)}m
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Transfer Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Squad */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ทีมปัจจุบัน ({currentSquad.starting.length + currentSquad.bench.length} คน)
                </h3>
                {transferCount > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    เลือกแล้ว {transferCount} คน
                  </span>
                )}
              </div>
              {transferCount === 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 คลิกที่นักเตะเพื่อเลือกขาย (สีแดง = เลือกแล้ว)
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ตัวจริง ({currentSquad.starting.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentSquad.starting.map((player) => {
                      const isSelected = transfersOut.includes(player.id);
                      return (
                        <button
                          key={player.id}
                          onClick={() => {
                            if (isSelected) {
                              setTransfersOut(transfersOut.filter(id => id !== player.id));
                            } else {
                              setTransfersOut([...transfersOut, player.id]);
                            }
                          }}
                          className={`p-3 rounded-lg flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-red-100 dark:bg-red-900/40 border-2 border-red-500"
                              : "bg-green-50 dark:bg-green-900/20 border-2 border-transparent hover:border-blue-400"
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {player.name.split(" ").pop()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {player.team} • {player.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              £{player.price}m
                            </p>
                            <p className="text-xs text-gray-500">
                              ฟอร์ม: {player.form.toFixed(1)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    สำรอง ({currentSquad.bench.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentSquad.bench.map((player) => {
                      const isSelected = transfersOut.includes(player.id);
                      return (
                        <button
                          key={player.id}
                          onClick={() => {
                            if (isSelected) {
                              setTransfersOut(transfersOut.filter(id => id !== player.id));
                            } else {
                              setTransfersOut([...transfersOut, player.id]);
                            }
                          }}
                          className={`p-3 rounded-lg flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-red-100 dark:bg-red-900/40 border-2 border-red-500"
                              : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-blue-400"
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {player.name.split(" ").pop()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {player.team} • {player.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              £{player.price}m
                            </p>
                            <p className="text-xs text-gray-500">
                              ฟอร์ม: {player.form.toFixed(1)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Chips */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Chips พิเศษ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setWildcardActive(!wildcardActive)}
                  disabled={chips.wildcard.used}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    wildcardActive
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : chips.wildcard.used
                        ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles
                      className={`w-6 h-6 ${
                        wildcardActive ? "text-purple-600" : "text-gray-400"
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Wildcard
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {chips.wildcard.used
                          ? "ใช้แล้ว"
                          : "ย้ายได้ไม่จำกัด"}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  disabled={chips.freeHit.used}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    chips.freeHit.used
                      ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArrowDownUp className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Free Hit
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {chips.freeHit.used ? "ใช้แล้ว" : "ย้ายชั่วคราว"}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Transfer List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                รายการย้าย
              </h3>

              {transferCount === 0 ? (
                <div className="text-center py-12">
                  <ArrowDownUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    ยังไม่มีการย้ายนักเตะ
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    คลิกเลือกนักเตะจากทีมปัจจุบันเพื่อขาย
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transfersOut.map((playerId, idx) => {
                    const player = [...currentSquad.starting, ...currentSquad.bench].find(p => p.id === playerId);
                    if (!player) return null;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {player.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {player.team} • £{player.price}m
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setTransfersOut(transfersOut.filter(id => id !== playerId))}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confirm Button */}
              {transferCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ต้นทุนการย้าย
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {pointsDeduction > 0
                          ? `-${pointsDeduction} คะแนน`
                          : "ฟรี"}
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      ยืนยันการย้าย
                    </button>
                  </div>
                  {pointsDeduction > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        คุณจะถูกหักคะแนน {pointsDeduction} คะแนน
                        เนื่องจากใช้สิทธิ์ย้ายเกิน
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="space-y-6">
            {/* Players to Sell */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                แนะนำให้ขาย
              </h3>
              {suggestedTransfers.playersToSell.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    ทีมของคุณดูดีอยู่แล้ว! 👍
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedTransfers.playersToSell.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {player.name}
                      </p>
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        ฟอร์มแย่
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{player.team}</span>
                      <span>£{player.price}m</span>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Players to Buy */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                แนะนำให้ซื้อ
              </h3>
              <div className="space-y-3">
                {suggestedTransfers.playersToBuy.slice(0, 3).map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {player.name}
                      </p>
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        ฟอร์มดี
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{player.team}</span>
                      <span>£{player.price}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
