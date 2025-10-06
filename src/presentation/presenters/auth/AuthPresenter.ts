/**
 * Auth Presenter
 * Handles business logic for Authentication pages (Mock Data)
 */

// View Model interfaces
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface AuthViewModel {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Presenter for Authentication
 */
export class AuthPresenter {
  /**
   * Mock login
   */
  async login(data: LoginFormData): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (data.email === "demo@soccertactics.com" && data.password === "password123") {
        return { success: true };
      }

      return {
        success: false,
        error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  }

  /**
   * Mock register
   */
  async register(data: RegisterFormData): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation
      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          error: "รหัสผ่านไม่ตรงกัน",
        };
      }

      if (data.password.length < 8) {
        return {
          success: false,
          error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        };
      }

      if (!data.acceptTerms) {
        return {
          success: false,
          error: "กรุณายอมรับข้อกำหนดและเงื่อนไข",
        };
      }

      // Mock success
      return { success: true };
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  }

  /**
   * Mock forgot password
   */
  async forgotPassword(
    data: ForgotPasswordFormData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!data.email.includes("@")) {
        return {
          success: false,
          error: "กรุณากรอกอีเมลที่ถูกต้อง",
        };
      }

      // Mock success
      return { success: true };
    } catch (error) {
      console.error("Error in forgot password:", error);
      throw error;
    }
  }

  /**
   * Mock social login
   */
  async socialLogin(
    provider: "google" | "facebook"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success
      return { success: true };
    } catch (error) {
      console.error("Error in social login:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for login page
   */
  async generateLoginMetadata() {
    return {
      title: "เข้าสู่ระบบ | Soccer Tactics",
      description: "เข้าสู่ระบบเพื่อเข้าถึงฟีเจอร์ทั้งหมดของ Soccer Tactics",
      keywords: "เข้าสู่ระบบ, login, soccer tactics",
    };
  }

  /**
   * Generate metadata for register page
   */
  async generateRegisterMetadata() {
    return {
      title: "สมัครสมาชิก | Soccer Tactics",
      description: "สมัครสมาชิกฟรีเพื่อเริ่มวิเคราะห์แทคติคฟุตบอล",
      keywords: "สมัครสมาชิก, register, soccer tactics",
    };
  }

  /**
   * Generate metadata for forgot password page
   */
  async generateForgotPasswordMetadata() {
    return {
      title: "ลืมรหัสผ่าน | Soccer Tactics",
      description: "รีเซ็ตรหัสผ่านของคุณ",
      keywords: "ลืมรหัสผ่าน, forgot password, reset password",
    };
  }
}

/**
 * Factory for creating AuthPresenter instances
 */
export class AuthPresenterFactory {
  static createServer(): AuthPresenter {
    return new AuthPresenter();
  }

  static createClient(): AuthPresenter {
    return new AuthPresenter();
  }
}
