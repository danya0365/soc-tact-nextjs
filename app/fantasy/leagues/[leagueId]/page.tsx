import LeagueDetailView from "@/src/presentation/components/fantasy/LeagueDetailView";
import { LeagueDetailPresenterFactory } from "@/src/presentation/presenters/fantasy/LeagueDetailPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "League Detail | Fantasy Football",
  description: "รายละเอียดลีก - ตารางคะแนน สถิติ และประวัติ",
  keywords: "league detail, standings, league stats, ลีก, ตารางคะแนน",
};

interface LeagueDetailPageProps {
  params: {
    leagueId: string;
  };
}

export default async function LeagueDetailPage({
  params,
}: LeagueDetailPageProps) {
  const presenter = LeagueDetailPresenterFactory.create();
  const viewModel = await presenter.getViewModel(params.leagueId);

  return <LeagueDetailView viewModel={viewModel} />;
}
