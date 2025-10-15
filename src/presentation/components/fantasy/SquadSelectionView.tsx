"use client";

import type { SquadSelectionViewModel } from "@/src/presentation/presenters/fantasy/SquadSelectionPresenter";
import type { FantasyPlayer } from "@/src/data/mock/fantasy/players.mock";
import PlayerDetailModal from "@/src/presentation/components/fantasy/PlayerDetailModal";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SquadSelectionViewProps {
  viewModel: SquadSelectionViewModel;
}

type PositionTab = "GK" | "DEF" | "MID" | "FWD";
type SortOption = "points" | "price" | "form" | "name";

export default function SquadSelectionView({
  viewModel,
}: SquadSelectionViewProps) {
  const { team, playersByPosition, budget, squadRules, formations } =
    viewModel;

  // State
  const [selectedPosition, setSelectedPosition] = useState<PositionTab>("FWD");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15]);
  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);

  // Get players for selected position
  const getPlayersForPosition = () => {
    let players =
      selectedPosition === "GK"
        ? playersByPosition.goalkeepers
        : selectedPosition === "DEF"
          ? playersByPosition.defenders
          : selectedPosition === "MID"
            ? playersByPosition.midfielders
            : playersByPosition.forwards;

    // Apply search filter
    if (searchQuery) {
      players = players.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply team filter
    if (selectedTeamFilter !== "all") {
      players = players.filter((p) => p.teamId === selectedTeamFilter);
    }

    // Apply price range filter
    players = players.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply sorting
    players = [...players].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "points":
          comparison = b.totalPoints - a.totalPoints;
          break;
        case "price":
          comparison = b.price - a.price;
          break;
        case "form":
          comparison = b.form - a.form;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortDirection === "asc" ? -comparison : comparison;
    });

    return players;
  };

  const filteredPlayers = getPlayersForPosition();

  // Position tabs
  const positionTabs: { key: PositionTab; label: string; count: number }[] = [
    { key: "GK", label: "ผู้รักษาประตู", count: squadRules.requiredPositions.GK },
    { key: "DEF", label: "กองหลัง", count: squadRules.requiredPositions.DEF },
    { key: "MID", label: "กองกลาง", count: squadRules.requiredPositions.MID },
    { key: "FWD", label: "กองหน้า", count: squadRules.requiredPositions.FWD },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            เลือกนักเตะ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            สร้างทีมในฝันของคุณ - เลือก 15 นักเตะ
          </p>
        </div>

        {/* Budget & Formation Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                งบประมาณ
              </p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              £{budget.remaining.toFixed(1)}m
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              จาก £{budget.total}m
            </p>
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((budget.total - budget.remaining) / budget.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                นักเตะที่เลือก
              </p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {team.squad.length}/{squadRules.totalPlayers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ต้องครบ 15 คน
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ฟอร์เมชั่น
              </p>
            </div>
            <select
              value={team.formation}
              className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
            >
              {formations.map((formation) => (
                <option key={formation} value={formation}>
                  {formation}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              {/* Position Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  {positionTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedPosition(tab.key)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        selectedPosition === tab.key
                          ? "text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 text-xs">({tab.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ค้นหานักเตะ..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  {/* Sort */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="points">คะแนน</option>
                      <option value="price">ราคา</option>
                      <option value="form">ฟอร์ม</option>
                      <option value="name">ชื่อ</option>
                    </select>

                    <button
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        )
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {sortDirection === "asc" ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Player List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {filteredPlayers.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      ไม่พบนักเตะที่ตรงกับเงื่อนไข
                    </p>
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <PlayerRow 
                      key={player.id} 
                      player={player}
                      onClick={() => setSelectedPlayer(player)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ตัวกรอง
                </h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ช่วงราคา: £{priceRange[0]}m - £{priceRange[1]}m
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseFloat(e.target.value)])
                  }
                  className="w-full"
                />
              </div>

              {/* Team Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ทีม
                </label>
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="all">ทุกทีม</option>
                  <option value="LIV">Liverpool</option>
                  <option value="MCI">Manchester City</option>
                  <option value="ARS">Arsenal</option>
                  <option value="MUN">Manchester United</option>
                  <option value="TOT">Tottenham</option>
                  <option value="CHE">Chelsea</option>
                  <option value="NEW">Newcastle</option>
                  <option value="AVL">Aston Villa</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTeamFilter("all");
                  setPriceRange([0, 15]);
                  setSortBy("points");
                  setSortDirection("desc");
                }}
                className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                รีเซ็ตตัวกรอง
              </button>
            </div>

            {/* Squad Rules */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-3">
                กฎการเลือกทีม
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• เลือกนักเตะ 15 คน</li>
                <li>• ผู้รักษาประตู 2 คน</li>
                <li>• กองหลัง 5 คน</li>
                <li>• กองกลาง 5 คน</li>
                <li>• กองหน้า 3 คน</li>
                <li>• สูงสุด 3 คนต่อทีม</li>
                <li>• งบประมาณ £100m</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onAddToSquad={() => {
            // TODO: Add player to squad logic
            console.log('Add player to squad:', selectedPlayer.name);
            setSelectedPlayer(null);
          }}
        />
      )}
    </div>
  );
}

// Player Row Component
function PlayerRow({ player, onClick }: { player: FantasyPlayer; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Player Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex-shrink-0"></div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {player.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {player.team} • {player.position}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">คะแนน</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {player.totalPoints}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">ฟอร์ม</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {player.form.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">ราคา</p>
            <p className="font-semibold text-green-600">£{player.price}m</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
