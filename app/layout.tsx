import type { Metadata } from "next";
import "../public/styles/index.css";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";

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
    <html lang="th">
      <body className="antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
