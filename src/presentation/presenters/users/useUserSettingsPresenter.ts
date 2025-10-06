/**
 * Custom hook for User Settings presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  UserSettingsPresenter,
  UserSettingsPresenterFactory,
  type UserSettingsViewModel,
  type UserProfileFormData,
  type UserSettingsFormData,
} from "./UserSettingsPresenter";

// State interface
export interface UserSettingsPresenterState {
  viewModel: UserSettingsViewModel | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  successMessage: string | null;
}

// Actions interface
export interface UserSettingsPresenterActions {
  refreshData: () => Promise<void>;
  updateProfile: (data: UserProfileFormData) => Promise<void>;
  updateSettings: (data: UserSettingsFormData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

/**
 * Custom hook for User Settings presenter
 */
export function useUserSettingsPresenter(
  initialViewModel: UserSettingsViewModel | null = null
): [UserSettingsPresenterState, UserSettingsPresenterActions] {
  const [presenter] = useState<UserSettingsPresenter>(() =>
    UserSettingsPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<UserSettingsViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading user settings:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Update profile
   */
  const updateProfile = useCallback(
    async (data: UserProfileFormData) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await presenter.updateProfile(data);
        setSuccessMessage("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
        setError(errorMessage);
        console.error("Error updating profile:", err);
      } finally {
        setSaving(false);
      }
    },
    [presenter, loadData]
  );

  /**
   * Update settings
   */
  const updateSettings = useCallback(
    async (data: UserSettingsFormData) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await presenter.updateSettings(data);
        setSuccessMessage("บันทึกการตั้งค่าเรียบร้อยแล้ว");
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า";
        setError(errorMessage);
        console.error("Error updating settings:", err);
      } finally {
        setSaving(false);
      }
    },
    [presenter, loadData]
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await presenter.changePassword(currentPassword, newPassword);
        setSuccessMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
        setError(errorMessage);
        console.error("Error changing password:", err);
      } finally {
        setSaving(false);
      }
    },
    [presenter]
  );

  /**
   * Load data on mount if no initial data
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: UserSettingsPresenterState = {
    viewModel,
    loading,
    error,
    saving,
    successMessage,
  };

  // Actions object
  const actions: UserSettingsPresenterActions = {
    refreshData,
    updateProfile,
    updateSettings,
    changePassword,
    setError,
    setSuccessMessage,
  };

  return [state, actions];
}
