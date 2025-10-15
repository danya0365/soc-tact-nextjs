import SquadSelectionView from "@/src/presentation/components/fantasy/SquadSelectionView";
import { SquadSelectionPresenterFactory } from "@/src/presentation/presenters/fantasy/SquadSelectionPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Squad Selection | Fantasy Football",
  description: "เลือกนักเตะ 15 คน สร้างทีมในฝันของคุณ",
  keywords: "fantasy squad, player selection, fpl squad, เลือกนักเตะ",
};

export default async function SquadSelectionPage() {
  const presenter = SquadSelectionPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <SquadSelectionView viewModel={viewModel} />;
}
