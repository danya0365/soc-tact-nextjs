import { LoginView } from "@/src/presentation/components/auth/LoginView";
import { AuthPresenterFactory } from "@/src/presentation/presenters/auth/AuthPresenter";
import type { Metadata } from "next";

/**
 * Generate metadata for the login page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = AuthPresenterFactory.createServer();

  try {
    return await presenter.generateLoginMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "เข้าสู่ระบบ | Soccer Tactics",
      description: "เข้าสู่ระบบเพื่อเข้าถึงฟีเจอร์ทั้งหมดของ Soccer Tactics",
    };
  }
}

/**
 * Login Page - Server Component for SEO optimization
 */
export default function LoginPage() {
  return <LoginView />;
}
