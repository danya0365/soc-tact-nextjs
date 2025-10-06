import MyTeamView from "@/src/presentation/components/fantasy/MyTeamView";
import { MyTeamPresenterFactory } from "@/src/presentation/presenters/fantasy/MyTeamPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Team | Fantasy Football",
  description: "ดูรายละเอียดทีม Fantasy ของคุณ - สถิติ การวิเคราะห์ และคำแนะนำ",
  keywords: "my team, fantasy team, team analysis, ทีมของฉัน",
};

export default async function MyTeamPage() {
  const presenter = MyTeamPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <MyTeamView viewModel={viewModel} />;
}
