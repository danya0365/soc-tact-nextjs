import TransfersView from "@/src/presentation/components/fantasy/TransfersView";
import { TransfersPresenterFactory } from "@/src/presentation/presenters/fantasy/TransfersPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfers | Fantasy Football",
  description: "ซื้อ-ขายนักเตะ ปรับปรุงทีมของคุณ",
  keywords: "fantasy transfers, player transfers, fpl transfers, ย้ายนักเตะ",
};

export default async function TransfersPage() {
  const presenter = TransfersPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <TransfersView viewModel={viewModel} />;
}
