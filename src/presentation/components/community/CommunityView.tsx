"use client";

import { useCommunityPresenter } from "@/src/presentation/presenters/community/useCommunityPresenter";
import type { CommunityViewModel } from "@/src/presentation/presenters/community/CommunityPresenter";
import Link from "next/link";

interface CommunityViewProps {
  initialViewModel?: CommunityViewModel;
}

export function CommunityView({ initialViewModel }: CommunityViewProps) {
  const [state, actions] = useCommunityPresenter(initialViewModel);
  const { viewModel, loading, error, activeTab, filterCategory } = state;

  // Helper functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return date.toLocaleDateString("th-TH", { month: "short", day: "numeric" });
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูลชุมชน...</p>
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
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">เกิดข้อผิดพลาด</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button onClick={actions.refreshData} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  const { stats, featuredPosts, popularGroups, topMembers, upcomingEvents, activePolls, trendingDiscussions, categories } = viewModel;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">⚽ Community Hub</h1>
            <p className="text-xl opacity-90">ชุมชนคอมมูนิตี้ฟุตบอล - เชื่อมต่อแฟนบอลทั่วโลก</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.totalMembers)}</div>
              <div className="text-sm opacity-80">สมาชิก</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.totalGroups)}</div>
              <div className="text-sm opacity-80">กลุ่ม</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.totalPosts)}</div>
              <div className="text-sm opacity-80">โพสต์</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.totalEvents)}</div>
              <div className="text-sm opacity-80">อีเวนท์</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.activeToday)}</div>
              <div className="text-sm opacity-80">ออนไลน์วันนี้</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{formatNumber(stats.postsToday)}</div>
              <div className="text-sm opacity-80">โพสต์วันนี้</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "feed", label: "📰 ฟีด", icon: "📰" },
              { id: "groups", label: "👥 กลุ่ม", icon: "👥" },
              { id: "events", label: "📅 อีเวนท์", icon: "📅" },
              { id: "discussions", label: "💬 สนทนา", icon: "💬" },
              { id: "polls", label: "📊 โพลล์", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => actions.setFilterCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !filterCategory
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              }`}
            >
              ทั้งหมด
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => actions.setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filterCategory === cat.id
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.icon} {cat.nameTh}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab: Feed */}
            {activeTab === "feed" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🔥 โพสต์ยอดนิยม</h2>
                  <button onClick={actions.openCreatePostModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    ➕ สร้างโพสต์
                  </button>
                </div>

                {featuredPosts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <img src={post.author.avatar} alt={post.author.displayName} className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{post.author.displayName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdDate)}</div>
                        </div>
                        {post.group && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            in <span className="font-medium text-green-600">{post.group.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Post Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h3>

                      {/* Post Content */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Post Stats */}
                      <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
                        <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
                          <span>👍</span>
                          <span>{formatNumber(post.stats.upvotes)}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <span>💬</span>
                          <span>{formatNumber(post.stats.comments)}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <span>👁️</span>
                          <span>{formatNumber(post.stats.views)}</span>
                        </div>
                        <button className="flex items-center gap-2 hover:text-orange-600 transition-colors ml-auto">
                          <span>🔗</span>
                          <span>แชร์</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Tab: Groups */}
            {activeTab === "groups" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">👥 กลุ่มยอดนิยม</h2>
                {popularGroups.map((group) => (
                  <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${group.banner})` }} />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{group.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{group.name}</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">{group.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div>👥 {formatNumber(group.stats.members)} สมาชิก</div>
                            <div>📝 {formatNumber(group.stats.posts)} โพสต์</div>
                            <div>🔥 {group.stats.postsToday} วันนี้</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => actions.openJoinGroupModal(group.id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                              เข้าร่วมกลุ่ม
                            </button>
                            <Link href={`/community/groups/${group.id}`} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg">
                              ดูกลุ่ม
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Tab: Events */}
            {activeTab === "events" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">📅 อีเวนท์ที่กำลังจะมาถึง</h2>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.banner})` }} />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm whitespace-nowrap">
                          {event.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(event.date).toLocaleString("th-TH")}</span>
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
                            {event.participants.length} / {event.maxParticipants || "∞"} คน
                          </span>
                        </div>
                      </div>
                      <button onClick={() => actions.rsvpEvent(event.id)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                        ✓ ลงทะเบียนเข้าร่วม
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Tab: Discussions */}
            {activeTab === "discussions" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">💬 กระทู้สนทนายอดนิยม</h2>
                {trendingDiscussions.map((disc) => (
                  <div key={disc.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{disc.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{disc.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <img src={disc.author.avatar} alt={disc.author.displayName} className="w-6 h-6 rounded-full" />
                        <span>{disc.author.displayName}</span>
                      </div>
                      <div>💬 {disc.stats.replies} ตอบกลับ</div>
                      <div>👁️ {formatNumber(disc.stats.views)} ดู</div>
                      <div className="ml-auto">{formatDate(disc.lastActivityDate)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {disc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Tab: Polls */}
            {activeTab === "polls" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">📊 โพลล์ที่กำลังเปิดอยู่</h2>
                {activePolls.map((poll) => (
                  <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{poll.question}</h3>
                    <div className="space-y-3 mb-4">
                      {poll.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => actions.votePoll(poll.id, option.id)}
                          className="w-full text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg p-4 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{option.text}</span>
                            <span className="text-sm font-bold text-green-600">{option.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${option.percentage}%` }} />
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatNumber(option.votes)} โหวต</div>
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ทั้งหมด {formatNumber(poll.totalVotes)} โหวต • สิ้นสุด {new Date(poll.endDate).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Members */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">🏆 สมาชิกอันดับต้น</h3>
              <div className="space-y-3">
                {topMembers.slice(0, 5).map((item) => (
                  <div key={item.member.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      item.rank === 1 ? "bg-yellow-400 text-yellow-900" : item.rank === 2 ? "bg-gray-300 text-gray-700" : item.rank === 3 ? "bg-orange-400 text-orange-900" : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.rank}
                    </div>
                    <img src={item.member.avatar} alt={item.member.displayName} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.member.displayName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatNumber(item.member.reputation)} คะแนน</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">🔗 ลิงก์ด่วน</h3>
              <div className="space-y-2">
                <Link href="/community/groups" className="block text-green-600 hover:text-green-700 dark:text-green-400">
                  → เข้าชมกลุ่มทั้งหมด
                </Link>
                <Link href="/community/events" className="block text-green-600 hover:text-green-700 dark:text-green-400">
                  → ดูอีเวนท์ทั้งหมด
                </Link>
                <Link href="/community/members" className="block text-green-600 hover:text-green-700 dark:text-green-400">
                  → รายชื่อสมาชิก
                </Link>
                <Link href="/community/rules" className="block text-green-600 hover:text-green-700 dark:text-green-400">
                  → กฎและข้อบังคับ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
