import GameweekPlannerView from "@/src/presentation/components/fantasy/GameweekPlannerView";
import { GameweekPlannerPresenterFactory } from "@/src/presentation/presenters/fantasy/GameweekPlannerPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gameweek Planner | Fantasy Football",
  description: "วางแผนล่วงหน้า 5 Gameweek - วิเคราะห์ตารางแข่งและแผนการย้าย",
  keywords: "gameweek planner, fixture tracker, planning, ตารางแข่ง, วางแผน",
};

export default async function GameweekPlannerPage() {
  const presenter = GameweekPlannerPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <GameweekPlannerView viewModel={viewModel} />;
}
