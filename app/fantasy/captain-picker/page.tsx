import CaptainPickerView from "@/src/presentation/components/fantasy/CaptainPickerView";
import { CaptainPickerPresenterFactory } from "@/src/presentation/presenters/fantasy/CaptainPickerPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Captain Picker & Differentials | Fantasy Football",
  description: "เลือกกัปตันและหานักเตะที่คนอื่นไม่เลือก - วิเคราะห์ด้วย AI",
  keywords: "captain picker, differential, hidden gems, template, กัปตัน",
};

export default async function CaptainPickerPage() {
  const presenter = CaptainPickerPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <CaptainPickerView viewModel={viewModel} />;
}
