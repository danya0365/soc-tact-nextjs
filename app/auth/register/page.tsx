import { RegisterView } from "@/src/presentation/components/auth/RegisterView";
import { AuthPresenterFactory } from "@/src/presentation/presenters/auth/AuthPresenter";
import type { Metadata } from "next";

/**
 * Generate metadata for the register page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = AuthPresenterFactory.createServer();

  try {
    return await presenter.generateRegisterMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "สมัครสมาชิก | Soccer Tactics",
      description: "สมัครสมาชิกฟรีเพื่อเริ่มวิเคราะห์แทคติคฟุตบอล",
    };
  }
}

/**
 * Register Page - Server Component for SEO optimization
 */
export default function RegisterPage() {
  return <RegisterView />;
}
