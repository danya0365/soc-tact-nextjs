"use client";

import type { TacticDetailViewModel } from "@/src/presentation/presenters/tactics/TacticDetailPresenter";
import { useTacticDetailPresenter } from "@/src/presentation/presenters/tactics/useTacticDetailPresenter";
import Link from "next/link";
import { useState } from "react";

interface TacticDetailViewProps {
  postId: string;
  initialViewModel?: TacticDetailViewModel;
}

export function TacticDetailView({
  postId,
  initialViewModel,
}: TacticDetailViewProps) {
  const [state, actions] = useTacticDetailPresenter(postId, initialViewModel);
  const post = state.viewModel?.post;
  const comments = state.viewModel?.comments || [];
  const relatedPosts = state.viewModel?.relatedPosts || [];
  const [commentText, setCommentText] = useState("");

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await actions.addComment(commentText);
    setCommentText("");
  };

  // Loading state
  if (state.loading && !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดบทวิเคราะห์...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                ไม่พบบทวิเคราะห์
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error || "ไม่พบบทวิเคราะห์ที่คุณต้องการ"}
              </p>
              <Link
                href="/tactics"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                กลับไปหน้ารายการ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/tactics"
          className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-6"
        >
          <span className="mr-2">←</span>
          กลับไปหน้ารายการ
        </Link>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
              {post.formation}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.league}
              </span>
              {post.team && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.team}
                  </span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{post.author.avatar}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.author.bio}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>👁️ {post.views}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          </div>

          {/* Related Match */}
          {post.relatedMatch && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                📊 วิเคราะห์จากการแข่งขัน
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post.relatedMatch.homeTeam} {post.relatedMatch.score}{" "}
                {post.relatedMatch.awayTeam}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.relatedMatch.date).toLocaleDateString("th-TH")}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={actions.upvotePost}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <span>👍</span>
                <span className="font-semibold">{post.upvotes}</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span>👎</span>
                <span className="font-semibold">{post.downvotes}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <span className="text-xl">🔗</span>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <span className="text-xl">📤</span>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <span className="text-xl">🔖</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            ความคิดเห็น ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="แสดงความคิดเห็น..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ส่งความคิดเห็น
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{comment.author.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {comment.author.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <span>👍</span>
                          <span>{comment.upvotes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <span>👎</span>
                          <span>{comment.downvotes}</span>
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          ตอบกลับ
                        </button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-8 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <span className="text-xl">{reply.author.avatar}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {reply.author.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(reply.createdAt)}
                                  </p>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                  {reply.content}
                                </p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <span>👍</span>
                                    <span>{reply.upvotes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              บทความที่เกี่ยวข้อง
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/tactics/${relatedPost.id}`}
                  className="group"
                >
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors">
                    <span className="text-3xl mb-3 block">
                      {relatedPost.thumbnail}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
