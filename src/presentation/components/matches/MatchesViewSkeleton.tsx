"use client";

export function MatchesViewSkeleton() {
  const statsSkeleton = Array.from({ length: 4 });
  const leagueSkeleton = Array.from({ length: 2 });
  const matchSkeleton = Array.from({ length: 3 });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statsSkeleton.map((_, index) => (
              <div
                key={`stats-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {leagueSkeleton.map((_, leagueIndex) => (
              <div key={`league-${leagueIndex}`} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {matchSkeleton.map((_, matchIndex) => (
                    <div
                      key={`match-${leagueIndex}-${matchIndex}`}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="space-y-2">
                          <div className="flex items-center justify-end space-x-2">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          </div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-8 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
