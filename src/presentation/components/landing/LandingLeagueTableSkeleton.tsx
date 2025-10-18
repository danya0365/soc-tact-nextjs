"use client";

export function LandingLeagueTableSkeleton() {
  const headerSkeleton = Array.from({ length: 9 });
  const rowSkeleton = Array.from({ length: 6 });
  const formSkeleton = Array.from({ length: 5 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="animate-pulse">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-green-600/80">
              <tr>
                {headerSkeleton.map((_, index) => (
                  <th key={`header-${index}`} className="px-4 py-3">
                    <div className="h-4 w-12 bg-green-500/60 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rowSkeleton.map((_, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-4">
                    <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-10 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 justify-center">
                      {formSkeleton.map((_, formIndex) => (
                        <div
                          key={`form-${rowIndex}-${formIndex}`}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-right">
          <div className="h-4 w-24 ml-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
