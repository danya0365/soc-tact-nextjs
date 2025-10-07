import { FantasyLayout } from "@/src/presentation/components/layout/FantasyLayout";

export default function FantasyRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FantasyLayout>{children}</FantasyLayout>;
}
