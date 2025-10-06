"use client";

import type { LeaguesViewModel } from "@/src/presentation/presenters/leagues/LeaguesPresenter";
import { useLeaguesPresenter } from "@/src/presentation/presenters/leagues/useLeaguesPresenter";
import Link from "next/link";

interface LeaguesViewProps {
  initialViewModel?: LeaguesViewModel;
}

export function LeaguesView({ initialViewModel }: LeaguesViewProps) {
  const [state, actions] = useLeaguesPresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลลีก...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error}
              </p>
              <button
                onClick={actions.refreshData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🏆</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลลีก
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ตารางคะแนนลีก
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ดูตารางคะแนนจากลีกชั้นนำทั่วโลก
          </p>
        </div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewModel.leagues.map((league) => (
            <Link
              key={league.id}
              href={`/leagues/${league.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{league.logo}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {league.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {league.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>ฤดูกาล:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {league.season}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>จำนวนทีม:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {league.totalTeams}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>นัดการแข่งขัน:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {league.currentMatchday}/{league.totalMatchdays}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                  <span className="font-semibold">ดูตารางคะแนน</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {viewModel.leagues.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
              ไม่พบข้อมูลลีก
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              ข้อมูลลีกจะแสดงที่นี่เมื่อมีข้อมูล
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
