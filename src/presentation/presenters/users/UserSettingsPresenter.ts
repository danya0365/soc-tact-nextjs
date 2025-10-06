/**
 * User Settings Presenter
 * Handles business logic for User Settings page
 */

import {
  getCurrentUser,
  getUserSettings,
  type MockUser,
  type MockUserSettings,
} from "@/src/data/mock/users.mock";
import { mockTeams } from "@/src/data/mock/teams.mock";

// Form data interface
export interface UserProfileFormData {
  displayName: string;
  bio: string;
  location?: string;
  website?: string;
  favoriteTeams: string[];
}

export interface UserSettingsFormData {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    commentNotifications: boolean;
    upvoteNotifications: boolean;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    theme: "light" | "dark" | "auto";
  };
}

// View Model interfaces
export interface UserSettingsViewModel {
  user: MockUser;
  settings: MockUserSettings;
  availableTeams: Array<{ id: string; name: string; logo: string }>;
}

/**
 * Presenter for User Settings page
 */
export class UserSettingsPresenter {
  /**
   * Get view model for user settings page
   */
  async getViewModel(): Promise<UserSettingsViewModel> {
    try {
      const user = getCurrentUser();
      const settings = getUserSettings();
      const availableTeams = Object.values(mockTeams).map((team) => ({
        id: team.id,
        name: team.name,
        logo: team.logo,
      }));

      return {
        user,
        settings,
        availableTeams,
      };
    } catch (error) {
      console.error("Error in UserSettingsPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for user settings page
   */
  async generateMetadata() {
    return {
      title: "ตั้งค่าบัญชี | Soccer Tactics",
      description: "จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ",
      keywords: "ตั้งค่า, settings, profile, account",
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UserProfileFormData): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Updating profile:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Update user settings
   */
  async updateSettings(data: UserSettingsFormData): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Updating settings:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Changing password");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating UserSettingsPresenter instances
 */
export class UserSettingsPresenterFactory {
  static createServer(): UserSettingsPresenter {
    return new UserSettingsPresenter();
  }

  static createClient(): UserSettingsPresenter {
    return new UserSettingsPresenter();
  }
}
