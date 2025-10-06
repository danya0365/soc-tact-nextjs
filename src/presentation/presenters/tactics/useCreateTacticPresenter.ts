/**
 * Custom hook for Create Tactic presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  CreateTacticPresenter,
  CreateTacticPresenterFactory,
  type CreateTacticViewModel,
  type CreateTacticFormData,
} from "./CreateTacticPresenter";
import { useRouter } from "next/navigation";

// State interface
export interface CreateTacticPresenterState {
  viewModel: CreateTacticViewModel | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  previewMode: boolean;
}

// Actions interface
export interface CreateTacticPresenterActions {
  refreshData: () => Promise<void>;
  createPost: (data: CreateTacticFormData) => Promise<void>;
  saveDraft: (data: CreateTacticFormData) => Promise<void>;
  togglePreview: () => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Create Tactic presenter
 */
export function useCreateTacticPresenter(
  initialViewModel: CreateTacticViewModel | null = null
): [CreateTacticPresenterState, CreateTacticPresenterActions] {
  const router = useRouter();
  const [presenter] = useState<CreateTacticPresenter>(() =>
    CreateTacticPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<CreateTacticViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      console.error("Error loading create tactic data:", err);
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
   * Create post
   */
  const createPost = useCallback(
    async (data: CreateTacticFormData) => {
      setSubmitting(true);
      setError(null);

      try {
        const result = await presenter.createPost(data);
        // Redirect to the new post
        router.push(`/tactics/${result.id}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการสร้างบทความ";
        setError(errorMessage);
        console.error("Error creating post:", err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [presenter, router]
  );

  /**
   * Save draft
   */
  const saveDraft = useCallback(
    async (data: CreateTacticFormData) => {
      setSubmitting(true);
      setError(null);

      try {
        await presenter.saveDraft(data);
        setError("บันทึกแบบร่างเรียบร้อยแล้ว");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการบันทึกแบบร่าง";
        setError(errorMessage);
        console.error("Error saving draft:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [presenter]
  );

  /**
   * Toggle preview mode
   */
  const togglePreview = useCallback(() => {
    setPreviewMode((prev) => !prev);
  }, []);

  /**
   * Load data on mount if no initial data
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: CreateTacticPresenterState = {
    viewModel,
    loading,
    error,
    submitting,
    previewMode,
  };

  // Actions object
  const actions: CreateTacticPresenterActions = {
    refreshData,
    createPost,
    saveDraft,
    togglePreview,
    setError,
  };

  return [state, actions];
}
