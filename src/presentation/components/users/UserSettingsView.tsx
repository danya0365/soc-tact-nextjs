"use client";

import type { UserSettingsViewModel } from "@/src/presentation/presenters/users/UserSettingsPresenter";
import { useUserSettingsPresenter } from "@/src/presentation/presenters/users/useUserSettingsPresenter";
import Link from "next/link";
import { useState } from "react";

interface UserSettingsViewProps {
  initialViewModel?: UserSettingsViewModel;
}

export function UserSettingsView({ initialViewModel }: UserSettingsViewProps) {
  const [state, actions] = useUserSettingsPresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Form states
  const [profileData, setProfileData] = useState({
    displayName: viewModel?.user.displayName || "",
    bio: viewModel?.user.bio || "",
    location: viewModel?.user.location || "",
    website: viewModel?.user.website || "",
    favoriteTeams: viewModel?.user.favoriteTeams.map((t) => t.id) || [],
  });

  const [settingsData, setSettingsData] = useState(
    viewModel?.settings || {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        commentNotifications: true,
        upvoteNotifications: false,
      },
      privacy: {
        showEmail: false,
        showLocation: true,
        allowMessages: true,
      },
      preferences: {
        language: "th",
        theme: "auto" as const,
      },
    }
  );

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "settings" | "password"
  >("profile");

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.updateProfile(profileData);
  };

  // Handle settings update
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.updateSettings(settingsData);
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      actions.setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    await actions.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Toggle favorite team
  const toggleFavoriteTeam = (teamId: string) => {
    setProfileData((prev) => ({
      ...prev,
      favoriteTeams: prev.favoriteTeams.includes(teamId)
        ? prev.favoriteTeams.filter((id) => id !== teamId)
        : [...prev.favoriteTeams, teamId],
    }));
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ตั้งค่าบัญชี
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ
            </p>
          </div>
          <Link
            href={`/profile/${viewModel.user.username}`}
            className="px-4 py-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            ดูโปรไฟล์
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              👤 ข้อมูลโปรไฟล์
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              ⚙️ การตั้งค่า
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "password"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              🔒 รหัสผ่าน
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                ข้อมูลส่วนตัว
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ชื่อที่แสดง
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ชื่อผู้ใช้
                  </label>
                  <input
                    type="text"
                    value={viewModel.user.username}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ประวัติส่วนตัว
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ที่อยู่
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      เว็บไซต์
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Teams */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                ทีมโปรด
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {viewModel.availableTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => toggleFavoriteTeam(team.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      profileData.favoriteTeams.includes(team.id)
                        ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{team.logo}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {team.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={state.saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                การแจ้งเตือน
              </h3>
              <div className="space-y-3">
                {Object.entries(settingsData.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {key === "emailNotifications" && "แจ้งเตือนทางอีเมล"}
                      {key === "pushNotifications" && "แจ้งเตือนแบบ Push"}
                      {key === "commentNotifications" && "แจ้งเตือนเมื่อมีความคิดเห็น"}
                      {key === "upvoteNotifications" && "แจ้งเตือนเมื่อมีการโหวต"}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                ความเป็นส่วนตัว
              </h3>
              <div className="space-y-3">
                {Object.entries(settingsData.privacy).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {key === "showEmail" && "แสดงอีเมล"}
                      {key === "showLocation" && "แสดงที่อยู่"}
                      {key === "allowMessages" && "อนุญาตให้ส่งข้อความ"}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            [key]: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                การตั้งค่าทั่วไป
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ภาษา
                  </label>
                  <select
                    value={settingsData.preferences.language}
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          language: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="th">ไทย</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ธีม
                  </label>
                  <select
                    value={settingsData.preferences.theme}
                    onChange={(e) =>
                      setSettingsData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          theme: e.target.value as "light" | "dark" | "auto",
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="light">สว่าง</option>
                    <option value="dark">มืด</option>
                    <option value="auto">อัตโนมัติ</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={state.saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                เปลี่ยนรหัสผ่าน
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={state.saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.saving ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </div>
          </form>
        )}

        {/* Success/Error Messages */}
        {(state.error || state.successMessage) && (
          <div
            className={`p-4 rounded-lg ${
              state.successMessage
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{state.successMessage || state.error}</span>
              <button
                onClick={() => {
                  actions.setError(null);
                  actions.setSuccessMessage(null);
                }}
                className="text-current hover:opacity-70"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
