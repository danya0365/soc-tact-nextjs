import PointsView from "@/src/presentation/components/fantasy/PointsView";
import { PointsPresenterFactory } from "@/src/presentation/presenters/fantasy/PointsPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Points & Statistics | Fantasy Football",
  description: "ดูคะแนนและสถิติของทีม Fantasy ของคุณ",
  keywords: "fantasy points, statistics, fpl stats, คะแนน fantasy",
};

export default async function PointsPage() {
  const presenter = PointsPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <PointsView viewModel={viewModel} />;
}
