import DreamTeamView from "@/src/presentation/components/fantasy/DreamTeamView";
import { DreamTeamPresenterFactory } from "@/src/presentation/presenters/fantasy/DreamTeamPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dream Team Builder | Fantasy Football",
  description: "สร้างทีมในฝันอัตโนมัติด้วย AI - เลือกกลยุทธ์และงบประมาณ",
  keywords: "dream team, auto pick, team builder, ai fantasy, สร้างทีมอัตโนมัติ",
};

export default async function DreamTeamPage() {
  const presenter = DreamTeamPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <DreamTeamView viewModel={viewModel} />;
}
