import FantasyDashboardView from "@/src/presentation/components/fantasy/FantasyDashboardView";
import { FantasyDashboardPresenterFactory } from "@/src/presentation/presenters/fantasy/FantasyDashboardPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fantasy Dashboard | Soccer Tactics",
  description: "จัดการทีม Fantasy Football ของคุณ - ดูคะแนน อันดับ และแก้ไขทีม",
  keywords:
    "fantasy football, premier league, fpl, fantasy dashboard, ทีมในฝัน",
};

export default async function FantasyDashboardPage() {
  const presenter = FantasyDashboardPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <FantasyDashboardView viewModel={viewModel} />;
}
