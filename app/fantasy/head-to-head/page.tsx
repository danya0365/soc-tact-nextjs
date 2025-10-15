import HeadToHeadView from "@/src/presentation/components/fantasy/HeadToHeadView";
import { HeadToHeadPresenterFactory } from "@/src/presentation/presenters/fantasy/HeadToHeadPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Head-to-Head Comparison | Fantasy Football",
  description: "เปรียบเทียบทีมของคุณกับคู่แข่ง - วิเคราะห์จุดแข็งจุดอ่อน",
  keywords: "head to head, team comparison, vs, เปรียบเทียบทีม",
};

export default async function HeadToHeadPage() {
  const presenter = HeadToHeadPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <HeadToHeadView viewModel={viewModel} />;
}
