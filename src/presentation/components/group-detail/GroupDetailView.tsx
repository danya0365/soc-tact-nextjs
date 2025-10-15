"use client";

import { useGroupDetailPresenter } from "@/src/presentation/presenters/group-detail/useGroupDetailPresenter";
import type { GroupDetailViewModel } from "@/src/presentation/presenters/group-detail/GroupDetailPresenter";
import Link from "next/link";

interface GroupDetailViewProps {
  groupId: string;
  initialViewModel?: GroupDetailViewModel;
}

export function GroupDetailView({
  groupId,
  initialViewModel,
}: GroupDetailViewProps) {
  const [state, actions] = useGroupDetailPresenter(groupId, initialViewModel);
  const { viewModel, loading, error, isJoined, activeTab } = state;

  // Helper functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return "วันนี้";
    if (diffDays < 2) return "เมื่อวาน";
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return formatDate(dateString);
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลกลุ่ม...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Link
                href="/community"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-block"
              >
                กลับไปหน้าชุมชน
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  const {
    group,
    groupType,
    creator,
    stats,
    members,
    recentPosts,
    upcomingEvents,
    topContributors,
  } = viewModel;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner Section */}
      <div
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${group.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start gap-6">
            {/* Group Icon */}
            <div className="text-8xl bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-lg -mt-12">
              {group.icon}
            </div>

            {/* Group Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {group.name}
                  </h1>
                  {groupType && (
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {groupType.icon} {groupType.nameTh}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {isJoined ? (
                    <button
                      onClick={actions.leaveGroup}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium"
                    >
                      ออกจากกลุ่ม
                    </button>
                  ) : (
                    <button
                      onClick={actions.joinGroup}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      ➕ เข้าร่วมกลุ่ม
                    </button>
                  )}
                  <button
                    onClick={actions.openInviteMemberModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    ✉️ เชิญเพื่อน
                  </button>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {group.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatNumber(stats.totalMembers)}
                  </span>
                  <span>สมาชิก</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatNumber(stats.totalPosts)}
                  </span>
                  <span>โพสต์</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatNumber(stats.postsToday)}
                  </span>
                  <span>โพสต์วันนี้</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {group.privacy === "public" ? "🌍" : "🔒"}
                  </span>
                  <span>{group.privacy === "public" ? "สาธารณะ" : "ส่วนตัว"}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span>สร้างเมื่อ {formatDate(group.createdDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {[
              { id: "posts", label: "📝 โพสต์", count: stats.totalPosts },
              { id: "members", label: "👥 สมาชิก", count: stats.totalMembers },
              { id: "events", label: "📅 อีเวนท์", count: stats.totalEvents },
              { id: "about", label: "ℹ️ เกี่ยวกับ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  actions.setActiveTab(tab.id as typeof activeTab)
                }
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab: Posts */}
            {activeTab === "posts" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    📝 โพสต์ล่าสุด
                  </h2>
                  {isJoined && (
                    <button
                      onClick={actions.openCreatePostModal}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      ➕ สร้างโพสต์
                    </button>
                  )}
                </div>

                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/community/posts/${post.id}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {post.author.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeDate(post.createdDate)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <span>👍</span>
                          <span>{formatNumber(post.stats.upvotes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>{formatNumber(post.stats.comments)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>{formatNumber(post.stats.views)}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      ยังไม่มีโพสต์ในกลุ่มนี้
                    </p>
                    {isJoined && (
                      <button
                        onClick={actions.openCreatePostModal}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                      >
                        สร้างโพสต์แรก
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Tab: Members */}
            {activeTab === "members" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  👥 สมาชิก ({stats.totalMembers} คน)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.displayName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {member.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{member.username}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              member.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : member.role === "moderator"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {member.role === "admin"
                              ? "👑 Admin"
                              : member.role === "moderator"
                              ? "🛡️ Mod"
                              : "👤"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tab: Events */}
            {activeTab === "events" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  📅 อีเวนท์ที่กำลังจะมาถึง
                </h2>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.banner})` }}
                      />
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {event.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>
                              {new Date(event.date).toLocaleString("th-TH")}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span>👥</span>
                            <span>
                              {event.participants.length} /{" "}
                              {event.maxParticipants || "∞"} คน
                            </span>
                          </div>
                        </div>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                          ✓ ลงทะเบียนเข้าร่วม
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      ยังไม่มีอีเวนท์ที่กำลังจะมาถึง
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Tab: About */}
            {activeTab === "about" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  ℹ️ เกี่ยวกับกลุ่ม
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      คำอธิบาย
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {group.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ประเภทกลุ่ม
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {groupType?.icon} {groupType?.nameTh}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {groupType?.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ความเป็นส่วนตัว
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {group.privacy === "public"
                        ? "🌍 กลุ่มสาธารณะ - ทุกคนสามารถดูและเข้าร่วมได้"
                        : "🔒 กลุ่มส่วนตัว - ต้องได้รับอนุมัติก่อนเข้าร่วม"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      แท็ก
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ผู้สร้าง
                    </h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.displayName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {creator.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{creator.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      สถิติ
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(stats.totalMembers)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          สมาชิกทั้งหมด
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(stats.activeMembers)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          สมาชิกที่ Active
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(stats.totalPosts)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          โพสต์ทั้งหมด
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(stats.postsThisWeek)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          โพสต์สัปดาห์นี้
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            {topContributors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  🏆 ผู้มีส่วนร่วมสูงสุด
                </h3>
                <div className="space-y-3">
                  {topContributors.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                            ? "bg-orange-400 text-orange-900"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <img
                        src={member.avatar}
                        alt={member.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {member.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {member.stats.posts} โพสต์
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group Rules */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                📋 กฎของกลุ่ม
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>เคารพสมาชิกคนอื่น</li>
                <li>ห้ามโพสต์เนื้อหาที่ไม่เหมาะสม</li>
                <li>ห้ามสแปมหรือโฆษณา</li>
                <li>ใช้ภาษาที่สุภาพ</li>
                <li>โพสต์เฉพาะเนื้อหาที่เกี่ยวข้องกับกลุ่ม</li>
              </ol>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                🔗 ลิงก์ด่วน
              </h3>
              <div className="space-y-2">
                <Link
                  href="/community"
                  className="block text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  → กลับไปหน้าชุมชน
                </Link>
                <Link
                  href="/community/groups"
                  className="block text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  → ดูกลุ่มทั้งหมด
                </Link>
                <button className="block text-red-600 hover:text-red-700 dark:text-red-400 w-full text-left">
                  → รายงานกลุ่ม
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
