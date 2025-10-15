"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GroupDetailPresenterFactory,
  type GroupDetailViewModel,
} from "./GroupDetailPresenter";

// Initialize presenter instance once (singleton pattern)
const presenter = GroupDetailPresenterFactory.createClient();

export interface GroupDetailPresenterState {
  viewModel: GroupDetailViewModel | null;
  loading: boolean;
  error: string | null;
  isJoined: boolean;
  isCreatePostModalOpen: boolean;
  isInviteMemberModalOpen: boolean;
  activeTab: "posts" | "members" | "events" | "about";
}

export interface GroupDetailPresenterActions {
  loadData: (groupId: string) => Promise<void>;
  joinGroup: () => Promise<void>;
  leaveGroup: () => Promise<void>;
  createPost: (data: Record<string, unknown>) => Promise<void>;
  inviteMember: (memberId: string) => Promise<void>;
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openInviteMemberModal: () => void;
  closeInviteMemberModal: () => void;
  setActiveTab: (tab: GroupDetailPresenterState["activeTab"]) => void;
  setError: (error: string | null) => void;
  refreshData: (groupId: string) => Promise<void>;
}

/**
 * Custom hook for Group Detail presenter
 * Provides state management and actions for Group Detail operations
 */
export function useGroupDetailPresenter(
  groupId: string,
  initialViewModel?: GroupDetailViewModel
): [GroupDetailPresenterState, GroupDetailPresenterActions] {
  const [viewModel, setViewModel] = useState<GroupDetailViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [isJoined, setIsJoined] = useState(false); // TODO: Get from user data
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<GroupDetailPresenterState["activeTab"]>("posts");

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async (groupId: string) => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(groupId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading group detail:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Join the group
   */
  const joinGroup = useCallback(async () => {
    if (!viewModel) return;

    setLoading(true);
    setError(null);

    try {
      await presenter.joinGroup(viewModel.group.id);
      setIsJoined(true);
      await loadData(viewModel.group.id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error joining group:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [viewModel, loadData]);

  /**
   * Leave the group
   */
  const leaveGroup = useCallback(async () => {
    if (!viewModel) return;

    setLoading(true);
    setError(null);

    try {
      await presenter.leaveGroup(viewModel.group.id);
      setIsJoined(false);
      await loadData(viewModel.group.id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error leaving group:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [viewModel, loadData]);

  /**
   * Create a post in the group
   */
  const createPost = useCallback(
    async (data: Record<string, unknown>) => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.createPost(viewModel.group.id, data);
        setIsCreatePostModalOpen(false);
        await loadData(viewModel.group.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error creating post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Invite a member to the group
   */
  const inviteMember = useCallback(
    async (memberId: string) => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.inviteMember(viewModel.group.id, memberId);
        setIsInviteMemberModalOpen(false);
        await loadData(viewModel.group.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error inviting member:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Refresh data
   */
  const refreshData = useCallback(
    async (groupId: string) => {
      await loadData(groupId);
    },
    [loadData]
  );

  // Modal actions
  const openCreatePostModal = useCallback(() => {
    setIsCreatePostModalOpen(true);
    setError(null);
  }, []);

  const closeCreatePostModal = useCallback(() => {
    setIsCreatePostModalOpen(false);
    setError(null);
  }, []);

  const openInviteMemberModal = useCallback(() => {
    setIsInviteMemberModalOpen(true);
    setError(null);
  }, []);

  const closeInviteMemberModal = useCallback(() => {
    setIsInviteMemberModalOpen(false);
    setError(null);
  }, []);

  // Load data on mount if no initial data
  useEffect(() => {
    if (!initialViewModel) {
      loadData(groupId);
    }
  }, [groupId, initialViewModel, loadData]);

  return [
    {
      viewModel,
      loading,
      error,
      isJoined,
      isCreatePostModalOpen,
      isInviteMemberModalOpen,
      activeTab,
    },
    {
      loadData,
      joinGroup,
      leaveGroup,
      createPost,
      inviteMember,
      openCreatePostModal,
      closeCreatePostModal,
      openInviteMemberModal,
      closeInviteMemberModal,
      setActiveTab,
      setError,
      refreshData,
    },
  ];
}
