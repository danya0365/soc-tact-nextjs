import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Soccer Tactics - วิเคราะห์แทคติคฟุตบอล",
  description:
    "แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล พร้อมระบบตารางคะแนนลีกและ Live Score",
  keywords:
    "แทคติคฟุตบอล, ผลบอลสด, ตารางคะแนน, วิเคราะห์บอล, tactical analysis",
  openGraph: {
    title: "Soccer Tactics - วิเคราะห์แทคติคฟุตบอล",
    description: "แพลตฟอร์มวิเคราะห์แทคติคฟุตบอลและ Live Score",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
