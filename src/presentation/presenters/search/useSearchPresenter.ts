/**
 * Custom hook for Search presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  SearchPresenter,
  SearchPresenterFactory,
  type SearchViewModel,
} from "./SearchPresenter";

// State interface
export interface SearchPresenterState {
  viewModel: SearchViewModel | null;
  loading: boolean;
  error: string | null;
  query: string;
  activeTab: "all" | "posts" | "teams" | "matches";
}

// Actions interface
export interface SearchPresenterActions {
  search: (query: string) => Promise<void>;
  setActiveTab: (tab: "all" | "posts" | "teams" | "matches") => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Search presenter
 */
export function useSearchPresenter(
  initialViewModel: SearchViewModel | null = null,
  initialQuery: string = ""
): [SearchPresenterState, SearchPresenterActions] {
  const [presenter] = useState<SearchPresenter>(() =>
    SearchPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<SearchViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTabState] = useState<
    "all" | "posts" | "teams" | "matches"
  >(initialViewModel?.activeTab || "all");

  /**
   * Perform search
   */
  const search = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);

      try {
        const newViewModel = await presenter.getViewModel(
          searchQuery,
          activeTab
        );
        setViewModel(newViewModel);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการค้นหา";
        setError(errorMessage);
        console.error("Error searching:", err);
      } finally {
        setLoading(false);
      }
    },
    [presenter, activeTab]
  );

  /**
   * Set active tab
   */
  const setActiveTab = useCallback(
    (tab: "all" | "posts" | "teams" | "matches") => {
      setActiveTabState(tab);
    },
    []
  );

  /**
   * Load initial data if query provided
   */
  useEffect(() => {
    if (initialQuery && !initialViewModel) {
      search(initialQuery);
    }
  }, [initialQuery, initialViewModel, search]);

  // State object
  const state: SearchPresenterState = {
    viewModel,
    loading,
    error,
    query,
    activeTab,
  };

  // Actions object
  const actions: SearchPresenterActions = {
    search,
    setActiveTab,
    setError,
  };

  return [state, actions];
}
