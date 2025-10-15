/**
 * Master Data: Community Categories
 * หมวดหมู่ของคอมมูนิตี้ฟุตบอล
 */

export interface CommunityCategory {
  id: string;
  name: string;
  nameTh: string;
  icon: string;
  description: string;
  color: string;
}

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  {
    id: "tactical-analysis",
    name: "Tactical Analysis",
    nameTh: "วิเคราะห์แทคติค",
    icon: "🎯",
    description: "Discuss football tactics and strategies",
    color: "bg-blue-500",
  },
  {
    id: "match-discussion",
    name: "Match Discussion",
    nameTh: "พูดคุยเกม",
    icon: "⚽",
    description: "Talk about recent and upcoming matches",
    color: "bg-green-500",
  },
  {
    id: "transfer-rumors",
    name: "Transfer Rumors",
    nameTh: "ข่าวซื้อขายนักเตะ",
    icon: "💰",
    description: "Discuss transfer news and rumors",
    color: "bg-yellow-500",
  },
  {
    id: "player-performance",
    name: "Player Performance",
    nameTh: "ผลงานนักเตะ",
    icon: "⭐",
    description: "Analyze and discuss player performances",
    color: "bg-purple-500",
  },
  {
    id: "fantasy-football",
    name: "Fantasy Football",
    nameTh: "แฟนตาซีฟุตบอล",
    icon: "🏆",
    description: "Fantasy football tips and strategies",
    color: "bg-orange-500",
  },
  {
    id: "general-discussion",
    name: "General Discussion",
    nameTh: "พูดคุยทั่วไป",
    icon: "💬",
    description: "General football discussions",
    color: "bg-gray-500",
  },
  {
    id: "memes-fun",
    name: "Memes & Fun",
    nameTh: "มีม & สนุกๆ",
    icon: "😂",
    description: "Football memes and funny content",
    color: "bg-pink-500",
  },
  {
    id: "news-updates",
    name: "News & Updates",
    nameTh: "ข่าวสารอัพเดท",
    icon: "📰",
    description: "Latest football news and updates",
    color: "bg-red-500",
  },
];

// Helper function to get category by ID
export function getCategoryById(id: string): CommunityCategory | undefined {
  return COMMUNITY_CATEGORIES.find((category) => category.id === id);
}
