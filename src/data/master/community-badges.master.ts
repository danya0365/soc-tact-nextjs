/**
 * Master Data: Community Badges & Achievements
 * เหรียญรางวัลและความสำเร็จในคอมมูนิตี้
 */

export interface Badge {
  id: string;
  name: string;
  nameTh: string;
  icon: string;
  description: string;
  requirement: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  color: string;
}

export const COMMUNITY_BADGES: Badge[] = [
  // Posting Badges
  {
    id: "first-post",
    name: "First Post",
    nameTh: "โพสต์แรก",
    icon: "🎉",
    description: "Created your first community post",
    requirement: "Create 1 post",
    rarity: "common",
    color: "bg-gray-500",
  },
  {
    id: "active-poster",
    name: "Active Poster",
    nameTh: "นักโพสต์ตัวจริง",
    icon: "📝",
    description: "Created 10 community posts",
    requirement: "Create 10 posts",
    rarity: "rare",
    color: "bg-blue-500",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    nameTh: "ผู้สร้างคอนเทนต์",
    icon: "✨",
    description: "Created 50 community posts",
    requirement: "Create 50 posts",
    rarity: "epic",
    color: "bg-purple-500",
  },
  {
    id: "community-legend",
    name: "Community Legend",
    nameTh: "ตำนานคอมมูนิตี้",
    icon: "👑",
    description: "Created 100 community posts",
    requirement: "Create 100 posts",
    rarity: "legendary",
    color: "bg-yellow-500",
  },
  
  // Engagement Badges
  {
    id: "helpful",
    name: "Helpful Member",
    nameTh: "สมาชิกผู้ช่วยเหลือ",
    icon: "🤝",
    description: "Received 50 upvotes on comments",
    requirement: "Get 50 upvotes",
    rarity: "rare",
    color: "bg-green-500",
  },
  {
    id: "popular",
    name: "Popular",
    nameTh: "ยอดนิยม",
    icon: "🌟",
    description: "Received 100 upvotes on posts",
    requirement: "Get 100 upvotes",
    rarity: "epic",
    color: "bg-orange-500",
  },
  {
    id: "influencer",
    name: "Influencer",
    nameTh: "ผู้มีอิทธิพล",
    icon: "💫",
    description: "Have 100 followers",
    requirement: "Get 100 followers",
    rarity: "epic",
    color: "bg-pink-500",
  },
  
  // Specialist Badges
  {
    id: "tactical-genius",
    name: "Tactical Genius",
    nameTh: "อัจฉริยะแทคติค",
    icon: "🧠",
    description: "Created 20 tactical analysis posts",
    requirement: "Create 20 tactical posts",
    rarity: "epic",
    color: "bg-indigo-500",
  },
  {
    id: "transfer-guru",
    name: "Transfer Guru",
    nameTh: "ผู้เชี่ยวชาญซื้อขาย",
    icon: "💼",
    description: "Active in transfer discussions",
    requirement: "Participate in 30 transfer discussions",
    rarity: "rare",
    color: "bg-teal-500",
  },
  {
    id: "match-predictor",
    name: "Match Predictor",
    nameTh: "นักทำนายผลบอล",
    icon: "🔮",
    description: "Made 50 accurate match predictions",
    requirement: "Predict 50 matches correctly",
    rarity: "epic",
    color: "bg-cyan-500",
  },
  
  // Time-based Badges
  {
    id: "early-supporter",
    name: "Early Supporter",
    nameTh: "ผู้สนับสนุนตั้งแต่แรก",
    icon: "🚀",
    description: "Joined during beta period",
    requirement: "Join during beta",
    rarity: "legendary",
    color: "bg-red-500",
  },
  {
    id: "veteran",
    name: "Veteran",
    nameTh: "ผู้เชี่ยวชาญ",
    icon: "🎖️",
    description: "Member for over 1 year",
    requirement: "Be member for 1 year",
    rarity: "epic",
    color: "bg-amber-500",
  },
  
  // Special Badges
  {
    id: "moderator",
    name: "Moderator",
    nameTh: "ผู้ดูแล",
    icon: "🛡️",
    description: "Community moderator",
    requirement: "Be appointed as moderator",
    rarity: "legendary",
    color: "bg-emerald-500",
  },
  {
    id: "verified",
    name: "Verified",
    nameTh: "ยืนยันตัวตน",
    icon: "✓",
    description: "Verified account",
    requirement: "Complete verification",
    rarity: "rare",
    color: "bg-blue-600",
  },
];

export const BADGE_RARITY_CONFIG = {
  common: {
    name: "Common",
    nameTh: "ธรรมดา",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  rare: {
    name: "Rare",
    nameTh: "หายาก",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  epic: {
    name: "Epic",
    nameTh: "เอพิค",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  legendary: {
    name: "Legendary",
    nameTh: "ตำนาน",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
};
