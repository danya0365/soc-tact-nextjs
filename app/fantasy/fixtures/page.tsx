import FixturesView from "@/src/presentation/components/fantasy/FixturesView";
import { FixturesPresenterFactory } from "@/src/presentation/presenters/fantasy/FixturesPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixtures & Player Stats | Fantasy Football",
  description: "ดูตารางแข่งขันและสถิตินักเตะ วิเคราะห์ความยากของคู่แข่ง",
  keywords: "fantasy fixtures, player stats, fpl fixtures, ตารางแข่ง",
};

export default async function FixturesPage() {
  const presenter = FixturesPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <FixturesView viewModel={viewModel} />;
}
