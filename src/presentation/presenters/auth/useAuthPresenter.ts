/**
 * Custom hook for Auth presenter
 */

import { useCallback, useState } from "react";
import {
  AuthPresenter,
  AuthPresenterFactory,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
} from "./AuthPresenter";
import { useRouter } from "next/navigation";

// State interface
export interface AuthPresenterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Actions interface
export interface AuthPresenterActions {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  socialLogin: (provider: "google" | "facebook") => Promise<void>;
  setError: (error: string | null) => void;
  resetState: () => void;
}

/**
 * Custom hook for Auth presenter
 */
export function useAuthPresenter(): [
  AuthPresenterState,
  AuthPresenterActions
] {
  const router = useRouter();
  const [presenter] = useState<AuthPresenter>(() =>
    AuthPresenterFactory.createClient()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Login
   */
  const login = useCallback(
    async (data: LoginFormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await presenter.login(data);

        if (result.success) {
          setSuccess(true);
          // Redirect to home after successful login
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          setError(result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        setError(errorMessage);
        console.error("Error logging in:", err);
      } finally {
        setLoading(false);
      }
    },
    [presenter, router]
  );

  /**
   * Register
   */
  const register = useCallback(
    async (data: RegisterFormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await presenter.register(data);

        if (result.success) {
          setSuccess(true);
          // Redirect to login after successful registration
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        } else {
          setError(result.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการสมัครสมาชิก";
        setError(errorMessage);
        console.error("Error registering:", err);
      } finally {
        setLoading(false);
      }
    },
    [presenter, router]
  );

  /**
   * Forgot password
   */
  const forgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await presenter.forgotPassword(data);

        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน";
        setError(errorMessage);
        console.error("Error in forgot password:", err);
      } finally {
        setLoading(false);
      }
    },
    [presenter]
  );

  /**
   * Social login
   */
  const socialLogin = useCallback(
    async (provider: "google" | "facebook") => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await presenter.socialLogin(provider);

        if (result.success) {
          setSuccess(true);
          // Redirect to home after successful login
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          setError(result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        setError(errorMessage);
        console.error("Error in social login:", err);
      } finally {
        setLoading(false);
      }
    },
    [presenter, router]
  );

  /**
   * Reset state
   */
  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  // State object
  const state: AuthPresenterState = {
    loading,
    error,
    success,
  };

  // Actions object
  const actions: AuthPresenterActions = {
    login,
    register,
    forgotPassword,
    socialLogin,
    setError,
    resetState,
  };

  return [state, actions];
}
