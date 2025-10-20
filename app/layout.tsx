import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Soc Tact - วิเคราะห์แทคติคฟุตบอลและ Live Score",
  description:
    "ศูนย์รวมแทคติคฟุตบอล ผลบอลสด และบทวิเคราะห์เชิงลึกแบบเรียลไทม์ พร้อมชุมชนแฟนบอลผู้หลงใหลเรื่องกลยุทธ์",
  keywords: [
    "football tactics",
    "แทคติคฟุตบอล",
    "live score",
    "วิเคราะห์บอล",
    "Soc Tact",
    "ตารางคะแนน",
    "กลยุทธ์ฟุตบอล",
    "stat analysis",
    "พรีเมียร์ลีก",
    "กัลโช่",
    "ลาลีกา",
    "ยูฟ่าแชมเปียนส์ลีก",
  ],
  authors: [{ name: "Soc Tact Team" }],
  creator: "Marosdee Uma",
  publisher: "Soc Tact",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Soc Tact - วิเคราะห์แทคติคฟุตบอลและ Live Score",
    description:
      "พลิกมุมมองเกมลูกหนังด้วยสถิติแทคติค ทีเด็ด และข้อมูลเรียลไทม์จากหลากหลายลีกทั่วโลก",
    type: "website",
    siteName: "Soc Tact",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Soc Tact - Football Tactics Platform",
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soc Tact - วิเคราะห์แทคติคฟุตบอลและ Live Score",
    description:
      "ติดตามแทคติค วิเคราะห์เกม และผลบอลสด พร้อมสถิติสำคัญที่ช่วยให้คุณไม่พลาดทุกจังหวะ",
    images: ["/og-image.png"],
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
