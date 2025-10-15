// Watchlist & Price Tracker Presenter
// Track favorite players and price changes

import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";

export interface PriceChange {
  date: string;
  oldPrice: number;
  newPrice: number;
  change: number;
}

export interface WatchlistPlayer extends FantasyPlayer {
  priceHistory: PriceChange[];
  priceChangeTonight: number; // Expected change tonight
  priceChangeProbability: number; // 0-100%
  transfersInOut: {
    transfersIn: number;
    transfersOut: number;
    netTransfers: number;
  };
  targetPrice?: number; // User's target buy/sell price
  alert: boolean; // Price alert enabled
}

export interface PriceChangePreview {
  risers: WatchlistPlayer[];
  fallers: WatchlistPlayer[];
  totalRisers: number;
  totalFallers: number;
  updateTime: string;
}

export interface WatchlistViewModel {
  watchlist: WatchlistPlayer[];
  priceChanges: PriceChangePreview;
  recentChanges: WatchlistPlayer[];
  topRisers: WatchlistPlayer[];
  topFallers: WatchlistPlayer[];
}

export class WatchlistPresenter {
  // Mock watchlist - in real app, this would be stored per user
  private mockWatchlistIds = ["fwd1", "mid1", "mid2", "def1", "gk1"];

  async getViewModel(): Promise<WatchlistViewModel> {
    // Get watchlist players
    const watchlistPlayers = FANTASY_PLAYERS.filter((p) =>
      this.mockWatchlistIds.includes(p.id)
    );

    // Enhance with price tracking data
    const watchlist: WatchlistPlayer[] = watchlistPlayers.map((player) => {
      // Mock price history
      const priceHistory: PriceChange[] = [
        {
          date: "2024-01-15",
          oldPrice: player.price - 0.3,
          newPrice: player.price - 0.2,
          change: 0.1,
        },
        {
          date: "2024-01-22",
          oldPrice: player.price - 0.2,
          newPrice: player.price - 0.1,
          change: 0.1,
        },
        {
          date: "2024-01-29",
          oldPrice: player.price - 0.1,
          newPrice: player.price,
          change: 0.1,
        },
      ];

      // Calculate expected price change based on form and ownership
      const formFactor = (player.form - 5) * 10;
      const ownershipFactor = (player.ownership - 25) * 2;
      const priceChangeProbability = Math.min(
        100,
        Math.max(0, 50 + formFactor + ownershipFactor)
      );

      let priceChangeTonight = 0;
      if (priceChangeProbability > 70) priceChangeTonight = 0.1;
      else if (priceChangeProbability < 30) priceChangeTonight = -0.1;

      // Mock transfers
      const baseTransfers = Math.floor(player.ownership * 10000);
      const transfersIn = baseTransfers + Math.floor(Math.random() * 5000);
      const transfersOut = baseTransfers - Math.floor(Math.random() * 3000);

      return {
        ...player,
        priceHistory,
        priceChangeTonight,
        priceChangeProbability,
        transfersInOut: {
          transfersIn,
          transfersOut,
          netTransfers: transfersIn - transfersOut,
        },
        alert: true,
      };
    });

    // All players with price tracking
    const allPlayersWithTracking: WatchlistPlayer[] = FANTASY_PLAYERS.map(
      (player) => {
        const priceHistory: PriceChange[] = [
          {
            date: "2024-01-29",
            oldPrice: player.price - 0.1,
            newPrice: player.price,
            change: 0.1,
          },
        ];

        const formFactor = (player.form - 5) * 10;
        const ownershipFactor = (player.ownership - 25) * 2;
        const priceChangeProbability = Math.min(
          100,
          Math.max(0, 50 + formFactor + ownershipFactor)
        );

        let priceChangeTonight = 0;
        if (priceChangeProbability > 70) priceChangeTonight = 0.1;
        else if (priceChangeProbability < 30) priceChangeTonight = -0.1;

        const baseTransfers = Math.floor(player.ownership * 10000);
        const transfersIn = baseTransfers + Math.floor(Math.random() * 5000);
        const transfersOut = baseTransfers - Math.floor(Math.random() * 3000);

        return {
          ...player,
          priceHistory,
          priceChangeTonight,
          priceChangeProbability,
          transfersInOut: {
            transfersIn,
            transfersOut,
            netTransfers: transfersIn - transfersOut,
          },
          alert: false,
        };
      }
    );

    // Price change preview
    const risers = allPlayersWithTracking
      .filter((p) => p.priceChangeTonight > 0)
      .sort((a, b) => b.priceChangeProbability - a.priceChangeProbability)
      .slice(0, 20);

    const fallers = allPlayersWithTracking
      .filter((p) => p.priceChangeTonight < 0)
      .sort((a, b) => a.priceChangeProbability - b.priceChangeProbability)
      .slice(0, 20);

    const priceChanges: PriceChangePreview = {
      risers,
      fallers,
      totalRisers: risers.length,
      totalFallers: fallers.length,
      updateTime: new Date().toISOString(),
    };

    // Recent changes (last 24 hours)
    const recentChanges = allPlayersWithTracking
      .filter((p) => p.priceHistory.length > 0)
      .sort(
        (a, b) =>
          new Date(b.priceHistory[b.priceHistory.length - 1].date).getTime() -
          new Date(a.priceHistory[a.priceHistory.length - 1].date).getTime()
      )
      .slice(0, 10);

    // Top risers (most price increases)
    const topRisers = [...allPlayersWithTracking]
      .sort((a, b) => {
        const aTotal = a.priceHistory.reduce((sum, h) => sum + h.change, 0);
        const bTotal = b.priceHistory.reduce((sum, h) => sum + h.change, 0);
        return bTotal - aTotal;
      })
      .slice(0, 10);

    // Top fallers (most price decreases)
    const topFallers = [...allPlayersWithTracking]
      .sort((a, b) => {
        const aTotal = a.priceHistory.reduce((sum, h) => sum + h.change, 0);
        const bTotal = b.priceHistory.reduce((sum, h) => sum + h.change, 0);
        return aTotal - bTotal;
      })
      .slice(0, 10);

    return {
      watchlist,
      priceChanges,
      recentChanges,
      topRisers,
      topFallers,
    };
  }

  addToWatchlist(playerId: string): void {
    // In real app, save to database
    console.log(`Added player ${playerId} to watchlist`);
  }

  removeFromWatchlist(playerId: string): void {
    // In real app, remove from database
    console.log(`Removed player ${playerId} from watchlist`);
  }

  toggleAlert(playerId: string, enabled: boolean): void {
    // In real app, update alert settings
    console.log(`Alert for player ${playerId}: ${enabled}`);
  }
}

export class WatchlistPresenterFactory {
  static create(): WatchlistPresenter {
    return new WatchlistPresenter();
  }
}
