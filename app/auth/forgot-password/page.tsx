import { ForgotPasswordView } from "@/src/presentation/components/auth/ForgotPasswordView";
import { AuthPresenterFactory } from "@/src/presentation/presenters/auth/AuthPresenter";
import type { Metadata } from "next";

/**
 * Generate metadata for the forgot password page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = AuthPresenterFactory.createServer();

  try {
    return await presenter.generateForgotPasswordMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ลืมรหัสผ่าน | Soccer Tactics",
      description: "รีเซ็ตรหัสผ่านของคุณ",
    };
  }
}

/**
 * Forgot Password Page - Server Component for SEO optimization
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
