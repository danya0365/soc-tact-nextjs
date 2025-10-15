"use client";

import { LandingViewModel } from "@/src/presentation/presenters/landing/LandingPresenter";
import { useLandingPresenter } from "@/src/presentation/presenters/landing/useLandingPresenter";
import Image from "next/image";
import Link from "next/link";

interface LandingViewProps {
  initialViewModel?: LandingViewModel;
}

export function LandingView({ initialViewModel }: LandingViewProps) {
  const [state, actions] = useLandingPresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse";
      case "finished":
        return "bg-gray-500";
      case "upcoming":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "D":
        return "bg-yellow-500";
      case "L":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            เกิดข้อผิดพลาด
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{state.error}</p>
          <button
            onClick={actions.refreshData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">⚽</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            ยังไม่มีข้อมูล
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="landing-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-900 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/pitch-pattern.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              ⚽ Soccer Tactics
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล
              <br />
              พร้อมตารางคะแนนและผลบอลสดแบบเรียลไทม์
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg">
                เริ่มต้นใช้งาน
              </button>
              <button className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition-colors shadow-lg border-2 border-white">
                ดูตัวอย่าง
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                {viewModel.stats.totalPosts.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                บทวิเคราะห์
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                {viewModel.stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                นักวิเคราะห์
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                {viewModel.stats.totalMatches.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                แมตช์สด
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                {viewModel.stats.totalLeagues.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                ลีก
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Live Matches Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-red-500 animate-pulse">🔴</span>
              ผลบอลสด
            </h2>
            <button className="text-green-600 hover:text-green-700 font-medium">
              ดูทั้งหมด →
            </button>
          </div>

          {viewModel.liveMatches.length === 0 ? (
            // Empty State
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                ยังไม่มีแมตช์ที่กำลังแข่งขัน
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                ไม่พบแมตช์ที่กำลังแข่งขันอยู่ในขณะนี้
                โปรดลองตรวจสอบอีกครั้งในภายหลัง
              </p>
              <button
                onClick={actions.refreshData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                โหลดข้อมูลใหม่
              </button>
            </div>
          ) : (
            // Live Matches Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewModel.liveMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 flex items-center justify-between">
                    <span className="text-white text-sm font-medium">
                      {match.league}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          match.status
                        )}`}
                      ></span>
                      <span className="text-white text-sm font-bold">
                        {match.minute}&apos;
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        {match.homeLogo.startsWith("http") ? (
                          <Image
                            src={match.homeLogo}
                            alt={match.homeTeam}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-3xl">{match.homeLogo}</span>
                        )}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {match.homeTeam}
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {match.homeScore}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {match.awayLogo.startsWith("http") ? (
                          <Image
                            src={match.awayLogo}
                            alt={match.awayTeam}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-3xl">{match.awayLogo}</span>
                        )}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {match.awayTeam}
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {match.awayScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* League Table Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              📊 ตารางคะแนน
            </h2>
            <Link
              href="/standings"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {/* League Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-wrap -mb-px overflow-x-auto">
              {viewModel.popularLeagues.map((league) => (
                <button
                  key={league}
                  onClick={() => actions.setSelectedLeague(league)}
                  className={`py-3 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                    state.selectedLeague === league
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>

          {/* League Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      ทีม
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      แข่ง
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      ชนะ
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      เสมอ
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      แพ้
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      +/-
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      คะแนน
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      ฟอร์ม
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {viewModel.leagueStandings.map((team) => (
                    <tr
                      key={team.position}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-4 text-center font-bold text-gray-900 dark:text-gray-100">
                        {team.position}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {team.logo.startsWith("http") ? (
                            <Image
                              src={team.logo}
                              alt={team.team}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-2xl">{team.logo}</span>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {team.team}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">
                        {team.played}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">
                        {team.won}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">
                        {team.drawn}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">
                        {team.lost}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-gray-100">
                        {team.goalDifference > 0 ? "+" : ""}
                        {team.goalDifference}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-green-600 text-lg">
                        {team.points}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1 justify-center">
                          {team.form.map((result, idx) => (
                            <div
                              key={idx}
                              className={`w-6 h-6 rounded-full ${getFormColor(
                                result
                              )} flex items-center justify-center text-white text-xs font-bold`}
                            >
                              {result}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🎯 บทวิเคราะห์แนะนำ
            </h2>
            <button className="text-green-600 hover:text-green-700 font-medium">
              ดูทั้งหมด →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewModel.featuredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-700 h-48 flex items-center justify-center text-8xl">
                  {post.thumbnail}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.formation}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.league}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{post.authorAvatar}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {post.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        👍 {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            พร้อมที่จะเป็นนักวิเคราะห์แล้วหรือยัง?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            เข้าร่วมชุมชนนักวิเคราะห์แทคติคฟุตบอลที่ใหญ่ที่สุด
            แชร์ความคิดเห็นและเรียนรู้จากผู้เชี่ยวชาญ
          </p>
          <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg">
            สมัครสมาชิกฟรี
          </button>
        </section>
      </div>
    </div>
  );
}
