"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CommunityPresenterFactory,
  type CommunityViewModel,
} from "./CommunityPresenter";

import { type CommunityPost } from "@/src/data/mock/community.mock";

// Initialize presenter instance once (singleton pattern)
const presenter = CommunityPresenterFactory.createClient();

export interface CommunityPresenterState {
  viewModel: CommunityViewModel | null;
  loading: boolean;
  error: string | null;
  isCreatePostModalOpen: boolean;
  isJoinGroupModalOpen: boolean;
  selectedGroupId: string | null;
  activeTab: "feed" | "groups" | "events" | "discussions" | "polls";
  filterCategory: string | null;
}

export interface CommunityPresenterActions {
  loadData: () => Promise<void>;
  createPost: (data: Partial<CommunityPost>) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  rsvpEvent: (eventId: string) => Promise<void>;
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openJoinGroupModal: (groupId: string) => void;
  closeJoinGroupModal: () => void;
  setActiveTab: (tab: CommunityPresenterState["activeTab"]) => void;
  setFilterCategory: (category: string | null) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
}

/**
 * Custom hook for Community presenter
 * Provides state management and actions for Community operations
 */
export function useCommunityPresenter(
  initialViewModel?: CommunityViewModel
): [CommunityPresenterState, CommunityPresenterActions] {
  const [viewModel, setViewModel] = useState<CommunityViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // UI states
  const [activeTab, setActiveTab] =
    useState<CommunityPresenterState["activeTab"]>("feed");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

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
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading community data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new post
   */
  const createPost = useCallback(
    async (data: Partial<CommunityPost>) => {
      setLoading(true);
      setError(null);

      try {
        await presenter.createPost(data);
        setIsCreatePostModalOpen(false);
        await loadData(); // Refresh data after creation
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
    [loadData]
  );

  /**
   * Join a group
   */
  const joinGroup = useCallback(
    async (groupId: string) => {
      setLoading(true);
      setError(null);

      try {
        await presenter.joinGroup(groupId);
        setIsJoinGroupModalOpen(false);
        setSelectedGroupId(null);
        await loadData(); // Refresh data after joining
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error joining group:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  /**
   * Vote on a poll
   */
  const votePoll = useCallback(
    async (pollId: string, optionId: string) => {
      setLoading(true);
      setError(null);

      try {
        await presenter.votePoll(pollId, optionId);
        await loadData(); // Refresh data after voting
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error voting on poll:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  /**
   * RSVP to an event
   */
  const rsvpEvent = useCallback(
    async (eventId: string) => {
      setLoading(true);
      setError(null);

      try {
        await presenter.rsvpEvent(eventId);
        await loadData(); // Refresh data after RSVP
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error RSVP to event:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Modal actions
  const openCreatePostModal = useCallback(() => {
    setIsCreatePostModalOpen(true);
    setError(null);
  }, []);

  const closeCreatePostModal = useCallback(() => {
    setIsCreatePostModalOpen(false);
    setError(null);
  }, []);

  const openJoinGroupModal = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
    setIsJoinGroupModalOpen(true);
    setError(null);
  }, []);

  const closeJoinGroupModal = useCallback(() => {
    setIsJoinGroupModalOpen(false);
    setSelectedGroupId(null);
    setError(null);
  }, []);

  // Load data on mount if no initial data
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return [
    {
      viewModel,
      loading,
      error,
      isCreatePostModalOpen,
      isJoinGroupModalOpen,
      selectedGroupId,
      activeTab,
      filterCategory,
    },
    {
      loadData,
      createPost,
      joinGroup,
      votePoll,
      rsvpEvent,
      openCreatePostModal,
      closeCreatePostModal,
      openJoinGroupModal,
      closeJoinGroupModal,
      setActiveTab,
      setFilterCategory,
      setError,
      refreshData,
    },
  ];
}
