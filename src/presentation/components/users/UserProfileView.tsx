"use client";

import type { UserProfileViewModel } from "@/src/presentation/presenters/users/UserProfilePresenter";
import { useUserProfilePresenter } from "@/src/presentation/presenters/users/useUserProfilePresenter";
import Link from "next/link";

interface UserProfileViewProps {
  username: string;
  initialViewModel?: UserProfileViewModel;
}

export function UserProfileView({
  username,
  initialViewModel,
}: UserProfileViewProps) {
  const [state, actions] = useUserProfilePresenter(username, initialViewModel);
  const user = state.viewModel?.user;
  const posts = state.viewModel?.posts || [];
  const isOwnProfile = state.viewModel?.isOwnProfile || false;

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
    }).format(new Date(dateString));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Loading state
  if (state.loading && !user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดโปรไฟล์...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error || !user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                ไม่พบผู้ใช้
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error || "ไม่พบผู้ใช้ที่คุณต้องการ"}
              </p>
              <Link
                href="/tactics"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="text-8xl">{user.avatar}</div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  @{user.username}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                  {user.bio}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.location && (
                    <span className="flex items-center">
                      <span className="mr-1">📍</span>
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-green-600 dark:hover:text-green-400"
                    >
                      <span className="mr-1">🔗</span>
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  <span className="flex items-center">
                    <span className="mr-1">📅</span>
                    เข้าร่วมเมื่อ {formatDate(user.joinedDate)}
                  </span>
                </div>

                {/* Social Links */}
                {user.socialLinks && (
                  <div className="flex space-x-3 mt-4">
                    {user.socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${user.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:opacity-70"
                      >
                        🐦
                      </a>
                    )}
                    {user.socialLinks.facebook && (
                      <a
                        href={`https://facebook.com/${user.socialLinks.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:opacity-70"
                      >
                        📘
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a
                        href={`https://instagram.com/${user.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:opacity-70"
                      >
                        📷
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {isOwnProfile ? (
                <Link
                  href="/profile/settings"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  ⚙️ แก้ไขโปรไฟล์
                </Link>
              ) : (
                <>
                  <button
                    onClick={
                      state.isFollowing ? actions.unfollowUser : actions.followUser
                    }
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      state.isFollowing
                        ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {state.isFollowing ? "กำลังติดตาม" : "ติดตาม"}
                  </button>
                  <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    💬 ส่งข้อความ
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.stats.posts}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">บทความ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(user.stats.upvotes)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                โหวตทั้งหมด
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.stats.followers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">ผู้ติดตาม</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.stats.following}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                กำลังติดตาม
              </p>
            </div>
          </div>

          {/* Favorite Teams */}
          {user.favoriteTeams.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                ทีมโปรด
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.favoriteTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-xl">{team.logo}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {team.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            บทวิเคราะห์ ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีบทวิเคราะห์
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                {isOwnProfile
                  ? "เริ่มเขียนบทวิเคราะห์แรกของคุณ"
                  : "ผู้ใช้ยังไม่ได้เผยแพร่บทวิเคราะห์"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/tactics/${post.id}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{post.thumbnail}</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                      {post.formation}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>👍 {post.upvotes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <span>👁️ {formatNumber(post.views)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
