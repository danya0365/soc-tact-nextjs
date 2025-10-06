"use client";

import type { CreateTacticViewModel } from "@/src/presentation/presenters/tactics/CreateTacticPresenter";
import { useCreateTacticPresenter } from "@/src/presentation/presenters/tactics/useCreateTacticPresenter";
import { useState } from "react";
import Link from "next/link";

interface CreateTacticViewProps {
  initialViewModel?: CreateTacticViewModel;
}

export function CreateTacticView({ initialViewModel }: CreateTacticViewProps) {
  const [state, actions] = useCreateTacticPresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    formation: "",
    league: "",
    team: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      actions.setError("กรุณากรอกหัวข้อบทความ");
      return;
    }
    if (!formData.content.trim()) {
      actions.setError("กรุณากรอกเนื้อหาบทความ");
      return;
    }
    if (!formData.formation) {
      actions.setError("กรุณาเลือกฟอร์เมชั่น");
      return;
    }

    try {
      await actions.createPost(formData);
    } catch (error) {
      // Error handled in hook
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    try {
      await actions.saveDraft(formData);
    } catch (error) {
      // Error handled in hook
    }
  };

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            สร้างบทวิเคราะห์แทคติค
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            แชร์ความรู้และมุมมองด้านแทคติคฟุตบอลของคุณกับชุมชน
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              หัวข้อบทความ *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น: วิเคราะห์แทคติค 4-3-3 ของ Man City..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ข้อมูลบทความ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ฟอร์เมชั่น *
                </label>
                <select
                  name="formation"
                  value={formData.formation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                >
                  <option value="">เลือกฟอร์เมชั่น</option>
                  {viewModel.availableFormations.map((formation) => (
                    <option key={formation} value={formation}>
                      {formation}
                    </option>
                  ))}
                </select>
              </div>

              {/* League */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ลีก
                </label>
                <select
                  name="league"
                  value={formData.league}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">เลือกลีก (ถ้ามี)</option>
                  {viewModel.availableLeagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ทีม
                </label>
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">เลือกทีม (ถ้ามี)</option>
                  {viewModel.availableTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                เนื้อหาบทความ *
              </label>
              <button
                type="button"
                onClick={actions.togglePreview}
                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
              >
                {state.previewMode ? "📝 แก้ไข" : "👁️ ดูตัวอย่าง"}
              </button>
            </div>

            {state.previewMode ? (
              <div className="min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {formData.content || "ยังไม่มีเนื้อหา..."}
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="เขียนบทวิเคราะห์ของคุณที่นี่...&#10;&#10;คุณสามารถใช้ Markdown formatting:&#10;# หัวข้อใหญ่&#10;## หัวข้อรอง&#10;- รายการ&#10;**ตัวหนา**"
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 resize-none font-mono text-sm"
                required
              />
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              แท็ก
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="เพิ่มแท็ก (กด Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                เพิ่ม
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={state.submitting}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 บันทึกแบบร่าง
              </button>
              <div className="flex space-x-3">
                <Link
                  href="/tactics"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  ยกเลิก
                </Link>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? "กำลังเผยแพร่..." : "📤 เผยแพร่บทความ"}
                </button>
              </div>
            </div>
          </div>

          {/* Error/Success Message */}
          {state.error && (
            <div
              className={`p-4 rounded-lg ${
                state.error.includes("เรียบร้อย")
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{state.error}</span>
                <button
                  onClick={() => actions.setError(null)}
                  className="text-current hover:opacity-70"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 เคล็ดลับการเขียนบทวิเคราะห์ที่ดี
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>✅ ใช้หัวข้อที่ชัดเจนและน่าสนใจ</li>
            <li>✅ อธิบายแทคติคด้วยภาษาที่เข้าใจง่าย</li>
            <li>✅ ใช้ตัวอย่างจากการแข่งขันจริง</li>
            <li>✅ เพิ่มแท็กที่เกี่ยวข้องเพื่อให้ค้นหาง่าย</li>
            <li>✅ ตรวจสอบความถูกต้องก่อนเผยแพร่</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
