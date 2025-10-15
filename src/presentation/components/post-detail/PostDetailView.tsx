"use client";

import { usePostDetailPresenter } from "@/src/presentation/presenters/post-detail/usePostDetailPresenter";
import type { PostDetailViewModel, CommentWithAuthor } from "@/src/presentation/presenters/post-detail/PostDetailPresenter";
import Link from "next/link";
import { useState } from "react";

interface PostDetailViewProps {
  postId: string;
  initialViewModel?: PostDetailViewModel;
}

export function PostDetailView({ postId, initialViewModel }: PostDetailViewProps) {
  const [state, actions] = usePostDetailPresenter(postId, initialViewModel);
  const { viewModel, loading, error, isCommentFormOpen, replyToCommentId, commentSortBy } = state;

  const [commentText, setCommentText] = useState("");

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

    if (diffMins < 1) return "เมื่อสักครู่";
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return date.toLocaleDateString("th-TH", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await actions.addComment(commentText, replyToCommentId || undefined);
      setCommentText("");
    } catch {
      // Error handled in hook
    }
  };

  // Sort comments
  const getSortedComments = (comments: CommentWithAuthor[]) => {
    const sorted = [...comments];
    switch (commentSortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
      case "popular":
      default:
        return sorted.sort((a, b) => b.stats.upvotes - a.stats.upvotes);
    }
  };

  // Render a single comment with nested replies
  const renderComment = (comment: CommentWithAuthor, depth: number = 0) => {
    const maxDepth = 3; // Limit nesting depth
    const isReplyingTo = replyToCommentId === comment.id;

    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-8 md:ml-12" : ""}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
          {/* Comment Header */}
          <div className="flex items-start gap-3 mb-3">
            <img src={comment.author.avatar} alt={comment.author.displayName} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{comment.author.displayName}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">@{comment.author.username}</span>
                {comment.isEdited && <span className="text-xs text-gray-400">(แก้ไขแล้ว)</span>}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdDate)}</span>
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 dark:text-gray-300 mb-3 pl-13">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 pl-13 text-sm">
            <button onClick={() => actions.voteComment(comment.id, "up")} className="flex items-center gap-1 hover:text-green-600 transition-colors">
              <span>👍</span>
              <span className="font-medium">{formatNumber(comment.stats.upvotes)}</span>
            </button>
            <button onClick={() => actions.voteComment(comment.id, "down")} className="flex items-center gap-1 hover:text-red-600 transition-colors">
              <span>👎</span>
              <span className="font-medium">{formatNumber(comment.stats.downvotes)}</span>
            </button>
            {depth < maxDepth && (
              <button onClick={() => actions.setReplyTo(comment.id)} className="text-blue-600 dark:text-blue-400 hover:underline">
                💬 ตอบกลับ
              </button>
            )}
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              🔗 แชร์
            </button>
            <button className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 ml-auto">
              ⚠️ รายงาน
            </button>
          </div>

          {/* Reply Form */}
          {isReplyingTo && (
            <div className="mt-4 pl-13">
              <form onSubmit={handleSubmitComment} className="space-y-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`ตอบกลับ @${comment.author.username}...`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    ส่งคำตอบ
                  </button>
                  <button type="button" onClick={() => { actions.setReplyTo(null); setCommentText(""); }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">กำลังโหลดโพสต์...</p>
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
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">เกิดข้อผิดพลาด</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Link href="/community" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-block">
                กลับไปหน้าชุมชน
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  const { post, author, group, category, comments, relatedPosts, stats } = viewModel;
  const sortedComments = getSortedComments(comments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-green-600">หน้าแรก</Link>
            <span>/</span>
            <Link href="/community" className="hover:text-green-600">ชุมชน</Link>
            {group && (
              <>
                <span>/</span>
                <Link href={`/community/groups/${group.id}`} className="hover:text-green-600">{group.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">โพสต์</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Post Media */}
              {post.media && post.media.length > 0 && (
                <img src={post.media[0]} alt={post.title} className="w-full h-96 object-cover" />
              )}

              <div className="p-6">
                {/* Post Header */}
                <div className="mb-6">
                  {category && (
                    <span className={`inline-block px-3 py-1 ${category.color} text-white rounded-full text-sm mb-3`}>
                      {category.icon} {category.nameTh}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{post.title}</h1>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <Link href={`/community/members/${author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <img src={author.avatar} alt={author.displayName} className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{author.displayName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">@{author.username} • {formatDate(post.createdDate)}</div>
                      </div>
                    </Link>
                    {group && (
                      <Link href={`/community/groups/${group.id}`} className="ml-auto text-sm text-green-600 hover:text-green-700 dark:text-green-400">
                        in {group.icon} {group.name}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/community?tag=${tag}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Post Stats & Actions */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => actions.votePost("up")} className="flex items-center gap-2 hover:text-green-600 transition-colors">
                    <span className="text-xl">👍</span>
                    <span className="font-semibold">{formatNumber(post.stats.upvotes)}</span>
                  </button>
                  <button onClick={() => actions.votePost("down")} className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <span className="text-xl">👎</span>
                    <span className="font-semibold">{formatNumber(post.stats.downvotes)}</span>
                  </button>
                  <button onClick={actions.openCommentForm} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <span className="text-xl">💬</span>
                    <span className="font-semibold">{formatNumber(stats.totalComments)}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-xl">👁️</span>
                    <span className="font-semibold">{formatNumber(post.stats.views)}</span>
                  </div>
                  <button onClick={actions.openShareModal} className="flex items-center gap-2 hover:text-orange-600 transition-colors ml-auto">
                    <span className="text-xl">🔗</span>
                    <span className="font-semibold">แชร์</span>
                  </button>
                  <button onClick={actions.bookmarkPost} className="hover:text-yellow-600 transition-colors">
                    <span className="text-xl">🔖</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  💬 ความคิดเห็น ({stats.totalComments})
                </h2>
                <select value={commentSortBy} onChange={(e) => actions.setSortBy(e.target.value as typeof commentSortBy)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="popular">ยอดนิยม</option>
                  <option value="newest">ล่าสุด</option>
                  <option value="oldest">เก่าสุด</option>
                </select>
              </div>

              {/* Comment Form */}
              {isCommentFormOpen && !replyToCommentId && (
                <div className="mb-6">
                  <form onSubmit={handleSubmitComment} className="space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="แสดงความคิดเห็น..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                        ส่งความคิดเห็น
                      </button>
                      <button type="button" onClick={actions.closeCommentForm} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add Comment Button */}
              {!isCommentFormOpen && (
                <button onClick={actions.openCommentForm} className="w-full mb-6 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors">
                  ➕ เพิ่มความคิดเห็น
                </button>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {sortedComments.length > 0 ? (
                  sortedComments.map((comment) => renderComment(comment))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">💬</div>
                    <p>ยังไม่มีความคิดเห็น</p>
                    <p className="text-sm">เป็นคนแรกที่แสดงความคิดเห็น!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">👤 เกี่ยวกับผู้เขียน</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={author.avatar} alt={author.displayName} className="w-16 h-16 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{author.displayName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">@{author.username}</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{author.bio}</p>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{author.stats.posts}</div>
                  <div className="text-xs text-gray-500">โพสต์</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{formatNumber(author.stats.followers)}</div>
                  <div className="text-xs text-gray-500">ผู้ติดตาม</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{author.reputation}</div>
                  <div className="text-xs text-gray-500">คะแนน</div>
                </div>
              </div>
              <Link href={`/community/members/${author.id}`} className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">
                ดูโปรไฟล์
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">📰 โพสต์ที่เกี่ยวข้อง</h3>
                <div className="space-y-4">
                  {relatedPosts.map(({ post: relPost, author: relAuthor }) => (
                    <Link key={relPost.id} href={`/community/posts/${relPost.id}`} className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{relPost.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <img src={relAuthor.avatar} alt={relAuthor.displayName} className="w-5 h-5 rounded-full" />
                        <span>{relAuthor.displayName}</span>
                        <span>•</span>
                        <span>👍 {formatNumber(relPost.stats.upvotes)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">⚡ การดำเนินการ</h3>
              <div className="space-y-2">
                <button onClick={actions.openShareModal} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔗 แชร์โพสต์
                </button>
                <button onClick={actions.bookmarkPost} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔖 บันทึกโพสต์
                </button>
                <button onClick={actions.openReportModal} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  ⚠️ รายงานโพสต์
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
