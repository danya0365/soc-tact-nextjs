"use client";

import type { MatchDetailViewModel } from "@/src/presentation/presenters/matches/MatchDetailPresenter";
import { useMatchDetailPresenter } from "@/src/presentation/presenters/matches/useMatchDetailPresenter";
import Link from "next/link";

interface MatchDetailViewProps {
  matchId: string;
  initialViewModel?: MatchDetailViewModel;
}

export function MatchDetailView({
  matchId,
  initialViewModel,
}: MatchDetailViewProps) {
  const [state, actions] = useMatchDetailPresenter(matchId, initialViewModel);
  const match = state.viewModel?.match;

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "finished":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "กำลังแข่ง";
      case "finished":
        return "จบการแข่งขัน";
      case "upcoming":
        return "ยังไม่เริ่ม";
      default:
        return status;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      case "substitution":
        return "🔄";
      case "var":
        return "📺";
      default:
        return "📋";
    }
  };

  // Loading state
  if (state.loading && !match) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลการแข่งขัน...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                ไม่พบข้อมูลการแข่งขัน
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error || "ไม่พบข้อมูลการแข่งขันที่คุณต้องการ"}
              </p>
              <Link
                href="/matches"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                กลับไปหน้ารายการแข่งขัน
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/matches"
          className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-6"
        >
          <span className="mr-2">←</span>
          กลับไปหน้ารายการแข่งขัน
        </Link>

        {/* Match Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{match.league.logo}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {match.league.name}
              </span>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                match.status
              )}`}
            >
              {match.status === "live" && match.minute
                ? `${match.minute}'`
                : getStatusText(match.status)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Home Team */}
            <div className="text-center">
              <div className="text-6xl mb-4">{match.homeTeam.logo}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {match.homeTeam.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {match.homeTeam.shortName}
              </p>
            </div>

            {/* Score */}
            <div className="text-center">
              {match.status === "upcoming" ? (
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-lg mb-2">
                    {new Date(match.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-3xl font-bold">{match.time}</div>
                </div>
              ) : (
                <>
                  <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {match.score.home} - {match.score.away}
                  </div>
                  {match.score.halftime && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      (HT: {match.score.halftime.home} -{" "}
                      {match.score.halftime.away})
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="text-6xl mb-4">{match.awayTeam.logo}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {match.awayTeam.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {match.awayTeam.shortName}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-6">
              <span>
                📍 {match.venue.name}, {match.venue.city}
              </span>
              {match.referee && <span>👨‍⚖️ {match.referee}</span>}
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        {match.status !== "upcoming" && match.statistics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              สถิติการแข่งขัน
            </h3>
            <div className="space-y-4">
              {Object.entries(match.statistics).map(([key, value]) => {
                const label = {
                  possession: "ครองบอล",
                  shots: "ยิงทั้งหมด",
                  shotsOnTarget: "ยิงเข้ากรอบ",
                  corners: "คอร์เนอร์",
                  fouls: "ฟาวล์",
                  yellowCards: "ใบเหลือง",
                  redCards: "ใบแดง",
                  offsides: "ล้ำหน้า",
                }[key];

                const homeValue = value.home;
                const awayValue = value.away;
                const total = homeValue + awayValue;
                const homePercent = total > 0 ? (homeValue / total) * 100 : 50;

                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold">
                        {homeValue}
                        {key === "possession" ? "%" : ""}
                      </span>
                      <span>{label}</span>
                      <span className="font-semibold">
                        {awayValue}
                        {key === "possession" ? "%" : ""}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600"
                        style={{ width: `${homePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Match Events */}
        {match.status !== "upcoming" &&
          match.events &&
          match.events.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                เหตุการณ์ในเกม
              </h3>
              <div className="space-y-4">
                {match.events.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center ${
                      event.team === "home" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-3 ${
                        event.team === "away"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <span className="text-2xl">
                        {getEventIcon(event.type)}
                      </span>
                      <div
                        className={event.team === "away" ? "text-right" : ""}
                      >
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.player}
                        </div>
                        {event.assist && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Assist: {event.assist}
                          </div>
                        )}
                        {event.detail && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.detail}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {event.minute}&apos;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Lineups */}
        {match.lineups && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Home Lineup */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {match.homeTeam.name} ({match.lineups.home.formation})
              </h3>
              <div className="space-y-2">
                {match.lineups.home.startXI.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-8">
                        {player.number}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {player.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Lineup */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {match.awayTeam.name} ({match.lineups.away.formation})
              </h3>
              <div className="space-y-2">
                {match.lineups.away.startXI.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-8">
                        {player.number}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {player.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Head to Head */}
        {match.headToHead && match.headToHead.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              ผลการเจอกันครั้งล่าสุด
            </h3>
            <div className="space-y-4">
              {match.headToHead.map((h2h) => (
                <div
                  key={h2h.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {new Date(h2h.date).toLocaleDateString("th-TH")} •{" "}
                      {h2h.competition}
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {h2h.homeTeam} vs {h2h.awayTeam}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {h2h.score.home} - {h2h.score.away}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
