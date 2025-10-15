/**
 * Mock Data: Community
 * ข้อมูลจำลองสำหรับคอมมูนิตี้ฟุตบอล
 */

import { COMMUNITY_CATEGORIES } from "../master/community-categories.master";
import { COMMUNITY_BADGES } from "../master/community-badges.master";
import { GROUP_TYPES } from "../master/community-group-types.master";

// ============= INTERFACES =============

export interface CommunityMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  reputation: number;
  level: number;
  badges: string[]; // badge IDs
  stats: {
    posts: number;
    comments: number;
    upvotes: number;
    followers: number;
    following: number;
  };
  favoriteTeam?: string;
  favoritePlayer?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  type: string; // GROUP_TYPES id
  privacy: "public" | "private" | "hidden";
  createdDate: string;
  createdBy: string; // member ID
  stats: {
    members: number;
    posts: number;
    postsToday: number;
  };
  tags: string[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  groupId?: string;
  category: string; // COMMUNITY_CATEGORIES id
  title: string;
  content: string;
  media?: string[]; // image URLs
  createdDate: string;
  editedDate?: string;
  stats: {
    upvotes: number;
    downvotes: number;
    comments: number;
    views: number;
    shares: number;
  };
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

export interface Poll {
  id: string;
  authorId: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  endDate: string;
  category: string;
  createdDate: string;
}

export interface CommunityEvent {
  id: string;
  organizerId: string;
  groupId?: string;
  title: string;
  description: string;
  type: "watch-party" | "meetup" | "tournament" | "discussion" | "other";
  date: string;
  endDate?: string;
  location?: string;
  isOnline: boolean;
  maxParticipants?: number;
  participants: string[]; // member IDs
  banner: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Discussion {
  id: string;
  authorId: string;
  groupId?: string;
  title: string;
  content: string;
  category: string;
  createdDate: string;
  lastActivityDate: string;
  stats: {
    replies: number;
    views: number;
    participants: number;
  };
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
}

// ============= MOCK DATA =============

export const MOCK_COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: "member-1",
    username: "tactical_genius",
    displayName: "Tactical Genius",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tactical",
    bio: "Football tactics enthusiast. Love analyzing formations and strategies.",
    joinedDate: "2024-01-15",
    reputation: 2580,
    level: 15,
    badges: ["tactical-genius", "active-poster", "helpful", "verified"],
    stats: {
      posts: 47,
      comments: 382,
      upvotes: 1240,
      followers: 234,
      following: 89,
    },
    favoriteTeam: "Manchester City",
    favoritePlayer: "Kevin De Bruyne",
  },
  {
    id: "member-2",
    username: "reddevil_fan",
    displayName: "Red Devil Forever",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reddevil",
    bio: "Manchester United supporter since birth. GGMU! 🔴",
    joinedDate: "2024-02-20",
    reputation: 1890,
    level: 12,
    badges: ["popular", "content-creator", "early-supporter"],
    stats: {
      posts: 62,
      comments: 298,
      upvotes: 876,
      followers: 156,
      following: 134,
    },
    favoriteTeam: "Manchester United",
  },
  {
    id: "member-3",
    username: "thai_football_fan",
    displayName: "คนรักบอลไทย",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thai",
    bio: "รักบอลไทย รักบอลโลก ชอบวิเคราะห์เกมและแทคติค",
    joinedDate: "2024-03-10",
    reputation: 1450,
    level: 10,
    badges: ["active-poster", "helpful", "transfer-guru"],
    stats: {
      posts: 38,
      comments: 215,
      upvotes: 645,
      followers: 98,
      following: 67,
    },
    favoriteTeam: "Thailand National Team",
  },
];

export const MOCK_COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "group-1",
    name: "Premier League Tactics Hub",
    description: "Deep dive into Premier League tactics, formations, and strategies",
    icon: "🎯",
    banner: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    type: "tactical-discussions",
    privacy: "public",
    createdDate: "2024-01-01",
    createdBy: "member-1",
    stats: {
      members: 1247,
      posts: 423,
      postsToday: 8,
    },
    tags: ["premier-league", "tactics", "analysis"],
  },
  {
    id: "group-2",
    name: "Manchester United Fans Thailand",
    description: "แฟนคลับแมนฯ ยูไนเต็ดในไทย พูดคุยเกม แชร์ความรู้สึก GGMU!",
    icon: "🔴",
    banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    type: "team-supporters",
    privacy: "public",
    createdDate: "2023-12-15",
    createdBy: "member-2",
    stats: {
      members: 3456,
      posts: 1892,
      postsToday: 24,
    },
    tags: ["manchester-united", "premier-league", "thailand"],
  },
  {
    id: "group-3",
    name: "Fantasy Premier League Thailand",
    description: "กลุ่มสำหรับคนเล่น FPL ในไทย แชร์ทีม แลกเปลี่ยนไอเดีย",
    icon: "⚡",
    banner: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    type: "fantasy-leagues",
    privacy: "public",
    createdDate: "2024-02-01",
    createdBy: "member-3",
    stats: {
      members: 892,
      posts: 567,
      postsToday: 15,
    },
    tags: ["fantasy", "fpl", "thailand"],
  },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "member-1",
    groupId: "group-1",
    category: "tactical-analysis",
    title: "Pep Guardiola's Inverted Fullback System Explained",
    content: "Let's analyze how Manchester City uses inverted fullbacks to control the midfield. This tactical innovation has changed modern football...",
    media: ["https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"],
    createdDate: "2025-10-15T10:30:00",
    stats: {
      upvotes: 342,
      downvotes: 12,
      comments: 67,
      views: 1823,
      shares: 45,
    },
    tags: ["man-city", "tactics", "pep-guardiola", "fullbacks"],
    isPinned: true,
    isLocked: false,
  },
  {
    id: "post-2",
    authorId: "member-2",
    groupId: "group-2",
    category: "match-discussion",
    title: "Man Utd vs Liverpool: What Went Wrong?",
    content: "After yesterday's disappointing loss, let's discuss what tactical adjustments we need...",
    createdDate: "2025-10-15T08:15:00",
    stats: {
      upvotes: 178,
      downvotes: 34,
      comments: 89,
      views: 923,
      shares: 23,
    },
    tags: ["manchester-united", "liverpool", "match-analysis"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "post-3",
    authorId: "member-3",
    groupId: "group-3",
    category: "fantasy-football",
    title: "GW8 Transfer Tips: Who to Bring In?",
    content: "Based on fixtures and form, here are my top picks for Gameweek 8 transfers. Haaland is a must-have...",
    createdDate: "2025-10-15T06:00:00",
    stats: {
      upvotes: 256,
      downvotes: 18,
      comments: 112,
      views: 1567,
      shares: 67,
    },
    tags: ["fpl", "transfers", "gameweek-8"],
    isPinned: false,
    isLocked: false,
  },
];

export const MOCK_POLLS: Poll[] = [
  {
    id: "poll-1",
    authorId: "member-1",
    question: "Who will win the Premier League 2024/25?",
    options: [
      { id: "opt-1", text: "Manchester City", votes: 1245, percentage: 45 },
      { id: "opt-2", text: "Arsenal", votes: 892, percentage: 32 },
      { id: "opt-3", text: "Liverpool", votes: 445, percentage: 16 },
      { id: "opt-4", text: "Other", votes: 192, percentage: 7 },
    ],
    totalVotes: 2774,
    endDate: "2025-11-01T23:59:59",
    category: "general-discussion",
    createdDate: "2025-10-01T10:00:00",
  },
  {
    id: "poll-2",
    authorId: "member-2",
    question: "Best formation for modern football?",
    options: [
      { id: "opt-1", text: "4-3-3", votes: 567, percentage: 38 },
      { id: "opt-2", text: "4-2-3-1", votes: 423, percentage: 28 },
      { id: "opt-3", text: "3-4-3", votes: 334, percentage: 22 },
      { id: "opt-4", text: "Other", votes: 178, percentage: 12 },
    ],
    totalVotes: 1502,
    endDate: "2025-10-20T23:59:59",
    category: "tactical-analysis",
    createdDate: "2025-10-14T14:00:00",
  },
];

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: "event-1",
    organizerId: "member-2",
    groupId: "group-2",
    title: "Man Utd vs Arsenal Watch Party",
    description: "Join us to watch the big match together! Food and drinks provided. Let's support the Red Devils!",
    type: "watch-party",
    date: "2025-10-20T19:00:00",
    location: "The Football Pub, Bangkok",
    isOnline: false,
    maxParticipants: 50,
    participants: ["member-1", "member-2", "member-3"],
    banner: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800",
    status: "upcoming",
  },
  {
    id: "event-2",
    organizerId: "member-1",
    groupId: "group-1",
    title: "Online Tactical Analysis Workshop",
    description: "Learn how to analyze football tactics like a pro. Free workshop for all members!",
    type: "discussion",
    date: "2025-10-18T20:00:00",
    endDate: "2025-10-18T22:00:00",
    isOnline: true,
    maxParticipants: 100,
    participants: ["member-1", "member-2", "member-3"],
    banner: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
    status: "upcoming",
  },
];

export const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "disc-1",
    authorId: "member-1",
    groupId: "group-1",
    title: "How would you defend against Haaland?",
    content: "He's been unstoppable this season. What tactical approach would you use to limit his impact?",
    category: "tactical-analysis",
    createdDate: "2025-10-14T09:00:00",
    lastActivityDate: "2025-10-15T18:30:00",
    stats: {
      replies: 45,
      views: 892,
      participants: 23,
    },
    isPinned: false,
    isLocked: false,
    tags: ["haaland", "defending", "tactics"],
  },
  {
    id: "disc-2",
    authorId: "member-3",
    groupId: "group-3",
    title: "Triple Captain Chip: When to use it?",
    content: "I still have my TC chip. Thinking about using it on Salah for the double gameweek. Thoughts?",
    category: "fantasy-football",
    createdDate: "2025-10-15T07:00:00",
    lastActivityDate: "2025-10-15T21:00:00",
    stats: {
      replies: 67,
      views: 1234,
      participants: 34,
    },
    isPinned: false,
    isLocked: false,
    tags: ["fpl", "triple-captain", "strategy"],
  },
];

// Helper function to get author details
export function getMemberById(id: string): CommunityMember | undefined {
  return MOCK_COMMUNITY_MEMBERS.find((member) => member.id === id);
}

// Helper function to get group details
export function getGroupById(id: string): CommunityGroup | undefined {
  return MOCK_COMMUNITY_GROUPS.find((group) => group.id === id);
}

// Helper function to get category details
export function getCategoryById(id: string) {
  return COMMUNITY_CATEGORIES.find((cat) => cat.id === id);
}

// Helper function to get badge details
export function getBadgeById(id: string) {
  return COMMUNITY_BADGES.find((badge) => badge.id === id);
}

// Helper function to get group type details
export function getGroupTypeById(id: string) {
  return GROUP_TYPES.find((type) => type.id === id);
}
