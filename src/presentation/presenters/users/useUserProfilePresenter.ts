/**
 * Custom hook for User Profile presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  UserProfilePresenter,
  UserProfilePresenterFactory,
  type UserProfileViewModel,
} from "./UserProfilePresenter";

// State interface
export interface UserProfilePresenterState {
  viewModel: UserProfileViewModel | null;
  loading: boolean;
  error: string | null;
  isFollowing: boolean;
}

// Actions interface
export interface UserProfilePresenterActions {
  refreshData: () => Promise<void>;
  followUser: () => Promise<void>;
  unfollowUser: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for User Profile presenter
 */
export function useUserProfilePresenter(
  username: string,
  initialViewModel: UserProfileViewModel | null = null
): [UserProfilePresenterState, UserProfilePresenterActions] {
  const [presenter] = useState<UserProfilePresenter>(() =>
    UserProfilePresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<UserProfileViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(username);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading user profile:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, username]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Follow user
   */
  const followUser = useCallback(async () => {
    if (!viewModel?.user) return;

    try {
      await presenter.followUser(viewModel.user.id);
      setIsFollowing(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการติดตาม";
      setError(errorMessage);
      console.error("Error following user:", err);
    }
  }, [presenter, viewModel]);

  /**
   * Unfollow user
   */
  const unfollowUser = useCallback(async () => {
    if (!viewModel?.user) return;

    try {
      await presenter.unfollowUser(viewModel.user.id);
      setIsFollowing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเลิกติดตาม";
      setError(errorMessage);
      console.error("Error unfollowing user:", err);
    }
  }, [presenter, viewModel]);

  /**
   * Load data on mount if no initial data
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: UserProfilePresenterState = {
    viewModel,
    loading,
    error,
    isFollowing,
  };

  // Actions object
  const actions: UserProfilePresenterActions = {
    refreshData,
    followUser,
    unfollowUser,
    setError,
  };

  return [state, actions];
}
