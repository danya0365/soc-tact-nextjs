"use client";

import type { WatchlistViewModel } from "@/src/presentation/presenters/fantasy/WatchlistPresenter";
import {
  Bell,
  BellOff,
  Eye,
  TrendingDown,
  TrendingUp,
  X,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { useState } from "react";

interface WatchlistViewProps {
  viewModel: WatchlistViewModel;
}

export default function WatchlistView({ viewModel }: WatchlistViewProps) {
  const { watchlist, priceChanges, recentChanges, topRisers, topFallers } =
    viewModel;

  const [selectedTab, setSelectedTab] = useState<
    "watchlist" | "tonight" | "recent" | "history"
  >("watchlist");

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4" />;
    if (change < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Watchlist & Price Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ติดตามนักเตะที่สนใจและการเปลี่ยนแปลงราคา
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Watchlist
              </p>
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {watchlist.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คืนนี้ขึ้น
              </p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {priceChanges.totalRisers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                คืนนี้ลง
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {priceChanges.totalFallers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alerts
              </p>
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {watchlist.filter((p) => p.alert).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("watchlist")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "watchlist"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Watchlist
          </button>
          <button
            onClick={() => setSelectedTab("tonight")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "tonight"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            เปลี่ยนคืนนี้
          </button>
          <button
            onClick={() => setSelectedTab("recent")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "recent"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            เปลี่ยนล่าสุด
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            ประวัติราคา
          </button>
        </div>

        {/* Watchlist Tab */}
        {selectedTab === "watchlist" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              นักเตะที่ติดตาม
            </h2>
            {watchlist.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  ยังไม่มีนักเตะใน Watchlist
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {watchlist.map((player, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {player.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {player.team} • {player.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          {player.alert ? (
                            <Bell className="w-5 h-5 text-orange-600" />
                          ) : (
                            <BellOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          ราคาปัจจุบัน
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          £{player.price}m
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          คาดการณ์คืนนี้
                        </p>
                        <div
                          className={`flex items-center gap-1 ${getPriceChangeColor(
                            player.priceChangeTonight
                          )}`}
                        >
                          {getPriceChangeIcon(player.priceChangeTonight)}
                          <span className="text-lg font-bold">
                            {player.priceChangeTonight > 0 ? "+" : ""}
                            {player.priceChangeTonight.toFixed(1)}m
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          โอกาส
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {player.priceChangeProbability.toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Net Transfers
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            player.transfersInOut.netTransfers > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {player.transfersInOut.netTransfers > 0 ? "+" : ""}
                          {(player.transfersInOut.netTransfers / 1000).toFixed(
                            1
                          )}
                          k
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tonight's Changes Tab */}
        {selectedTab === "tonight" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ราคาขึ้นคืนนี้
                </h2>
              </div>
              <div className="space-y-3">
                {priceChanges.risers.slice(0, 10).map((player, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
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
                          {player.priceChangeProbability.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">โอกาส</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fallers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ราคาลงคืนนี้
                </h2>
              </div>
              <div className="space-y-3">
                {priceChanges.fallers.slice(0, 10).map((player, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
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
                          {player.priceChangeProbability.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">โอกาส</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Changes Tab */}
        {selectedTab === "recent" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              การเปลี่ยนแปลงล่าสุด
            </h2>
            <div className="space-y-3">
              {recentChanges.map((player, idx) => {
                const lastChange =
                  player.priceHistory[player.priceHistory.length - 1];
                return (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {player.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {player.team} • {player.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center gap-1 justify-end ${getPriceChangeColor(
                            lastChange.change
                          )}`}
                        >
                          {getPriceChangeIcon(lastChange.change)}
                          <span className="text-lg font-bold">
                            £{lastChange.newPrice}m
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(lastChange.date).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Risers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ขึ้นราคามากสุด
                </h2>
              </div>
              <div className="space-y-3">
                {topRisers.map((player, idx) => {
                  const totalChange = player.priceHistory.reduce(
                    (sum, h) => sum + h.change,
                    0
                  );
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
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
                            +£{totalChange.toFixed(1)}m
                          </p>
                          <p className="text-xs text-gray-500">
                            {player.priceHistory.length} ครั้ง
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Fallers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDown className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ลงราคามากสุด
                </h2>
              </div>
              <div className="space-y-3">
                {topFallers.map((player, idx) => {
                  const totalChange = player.priceHistory.reduce(
                    (sum, h) => sum + h.change,
                    0
                  );
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
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
                            £{totalChange.toFixed(1)}m
                          </p>
                          <p className="text-xs text-gray-500">
                            {player.priceHistory.length} ครั้ง
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
