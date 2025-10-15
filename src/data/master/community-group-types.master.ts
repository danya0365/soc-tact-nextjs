/**
 * Master Data: Community Group Types
 * ประเภทของกลุ่มคอมมูนิตี้
 */

export interface GroupType {
  id: string;
  name: string;
  nameTh: string;
  icon: string;
  description: string;
  color: string;
}

export const GROUP_TYPES: GroupType[] = [
  {
    id: "team-supporters",
    name: "Team Supporters",
    nameTh: "แฟนคลับทีม",
    icon: "🏟️",
    description: "Fan groups for specific football teams",
    color: "bg-red-500",
  },
  {
    id: "league-fans",
    name: "League Fans",
    nameTh: "แฟนลีก",
    icon: "🏆",
    description: "Groups dedicated to specific leagues",
    color: "bg-blue-500",
  },
  {
    id: "tactical-discussions",
    name: "Tactical Discussions",
    nameTh: "วิเคราะห์แทคติค",
    icon: "🎯",
    description: "Groups focused on tactical analysis",
    color: "bg-purple-500",
  },
  {
    id: "fantasy-leagues",
    name: "Fantasy Leagues",
    nameTh: "ลีกแฟนตาซี",
    icon: "⚡",
    description: "Fantasy football league communities",
    color: "bg-yellow-500",
  },
  {
    id: "local-communities",
    name: "Local Communities",
    nameTh: "ชุมชนท้องถิ่น",
    icon: "📍",
    description: "Location-based football communities",
    color: "bg-green-500",
  },
  {
    id: "watch-parties",
    name: "Watch Parties",
    nameTh: "ดูบอลร่วมกัน",
    icon: "📺",
    description: "Groups organizing match watch parties",
    color: "bg-orange-500",
  },
  {
    id: "betting-tips",
    name: "Betting & Tips",
    nameTh: "พนันและทิป",
    icon: "🎲",
    description: "Betting predictions and tips (18+)",
    color: "bg-indigo-500",
  },
  {
    id: "player-fans",
    name: "Player Fans",
    nameTh: "แฟนคลับนักเตะ",
    icon: "⭐",
    description: "Fan groups for specific players",
    color: "bg-pink-500",
  },
];

export const GROUP_PRIVACY_TYPES = {
  public: {
    id: "public",
    name: "Public",
    nameTh: "สาธารณะ",
    icon: "🌍",
    description: "Anyone can see and join this group",
  },
  private: {
    id: "private",
    name: "Private",
    nameTh: "ส่วนตัว",
    icon: "🔒",
    description: "Only members can see posts, approval required to join",
  },
  hidden: {
    id: "hidden",
    name: "Hidden",
    nameTh: "ซ่อน",
    icon: "👁️",
    description: "Only members can find and see this group",
  },
};
