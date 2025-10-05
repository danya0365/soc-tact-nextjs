"use client";

import { LandingViewModel } from "@/src/presentation/presenters/landing/LandingPresenter";
import { useLandingPresenter } from "@/src/presentation/presenters/landing/useLandingPresenter";

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

  // Helper function for date formatting (reserved for future use)
  // const formatDate = (dateString: string) => {
  //   return new Intl.DateTimeFormat("th-TH", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(new Date(dateString));
  // };

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
                      <span className="text-3xl">{match.homeLogo}</span>
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
                      <span className="text-3xl">{match.awayLogo}</span>
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
        </section>

        {/* League Table Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              📊 ตารางคะแนน
            </h2>
            <select
              value={state.selectedLeague}
              onChange={(e) => actions.setSelectedLeague(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {viewModel.popularLeagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>

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
                          <span className="text-2xl">{team.logo}</span>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">⚽ Soccer Tactics</h3>
              <p className="text-gray-400">
                แพลตฟอร์มวิเคราะห์แทคติคฟุตบอลอันดับ 1 ของไทย
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    เกี่ยวกับเรา
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ทีมงาน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ติดต่อเรา
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ฟีเจอร์</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    บทวิเคราะห์
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ผลบอลสด
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ตารางคะแนน
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดตามเรา</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-2xl hover:text-green-400 transition-colors"
                >
                  📘
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-green-400 transition-colors"
                >
                  🐦
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-green-400 transition-colors"
                >
                  📷
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Soccer Tactics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
