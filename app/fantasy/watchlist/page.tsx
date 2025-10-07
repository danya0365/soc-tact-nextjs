import WatchlistView from "@/src/presentation/components/fantasy/WatchlistView";
import { WatchlistPresenterFactory } from "@/src/presentation/presenters/fantasy/WatchlistPresenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist & Price Tracker | Fantasy Football",
  description: "ติดตามนักเตะที่สนใจและการเปลี่ยนแปลงราคา - Price Alert",
  keywords: "watchlist, price tracker, price changes, ราคา, ติดตาม",
};

export default async function WatchlistPage() {
  const presenter = WatchlistPresenterFactory.create();
  const viewModel = await presenter.getViewModel();

  return <WatchlistView viewModel={viewModel} />;
}
