import LeaguesView from "@/src/presentation/components/fantasy/LeaguesView";
import { LeaguesPresenterFactory } from "@/src/presentation/presenters/fantasy/LeaguesPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues | Fantasy Football",
  description: "จัดการลีก Fantasy ของคุณ แข่งขันกับเพื่อนและผู้เล่นทั่วโลก",
  keywords: "fantasy leagues, fpl leagues, private leagues, ลีก fantasy",
};

export default async function LeaguesPage() {
  const presenter = LeaguesPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <LeaguesView viewModel={viewModel} />;
}
