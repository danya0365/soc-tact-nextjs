/**
 * Mock Data for Users
 * Used for UI development before API integration
 */

export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  email: string;
  joinedDate: string;
  location?: string;
  website?: string;
  favoriteTeams: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
  stats: {
    posts: number;
    upvotes: number;
    followers: number;
    following: number;
  };
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface MockUserPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  formation: string;
  upvotes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export interface MockUserSettings {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    commentNotifications: boolean;
    upvoteNotifications: boolean;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    theme: "light" | "dark" | "auto";
  };
}

// Mock Users Data
export const mockUsers: Record<string, MockUser> = {
  "tactical-genius": {
    id: "user-001",
    username: "tactical-genius",
    displayName: "Tactical Genius",
    avatar: "👨‍💼",
    bio: "นักวิเคราะห์แทคติคฟุตบอล ผู้เชี่ยวชาญด้าน Positional Play และ Build-up Play มีประสบการณ์วิเคราะห์มากกว่า 10 ปี",
    email: "tactical.genius@example.com",
    joinedDate: "2023-01-15",
    location: "Bangkok, Thailand",
    website: "https://tacticalgenius.com",
    favoriteTeams: [
      { id: "team-001", name: "Manchester City", logo: "⚽" },
      { id: "team-002", name: "Arsenal", logo: "🔴" },
    ],
    stats: {
      posts: 24,
      upvotes: 1250,
      followers: 342,
      following: 89,
    },
    socialLinks: {
      twitter: "@tacticalgenius",
      facebook: "tacticalgenius",
    },
  },
  "football-analyst": {
    id: "user-002",
    username: "football-analyst",
    displayName: "Football Analyst",
    avatar: "🎯",
    bio: "วิเคราะห์แทคติคทีมชั้นนำ เชี่ยวชาญด้าน Build-up Play และ Pressing Systems",
    email: "football.analyst@example.com",
    joinedDate: "2023-03-20",
    location: "London, UK",
    favoriteTeams: [
      { id: "team-002", name: "Arsenal", logo: "🔴" },
      { id: "team-003", name: "Liverpool", logo: "🔴" },
    ],
    stats: {
      posts: 18,
      upvotes: 890,
      followers: 256,
      following: 67,
    },
  },
  "press-master": {
    id: "user-003",
    username: "press-master",
    displayName: "Press Master",
    avatar: "⚡",
    bio: "ผู้เชี่ยวชาญด้าน Pressing และ Counter-pressing เน้นวิเคราะห์ Gegenpressing",
    email: "press.master@example.com",
    joinedDate: "2023-05-10",
    location: "Liverpool, UK",
    favoriteTeams: [{ id: "team-003", name: "Liverpool", logo: "🔴" }],
    stats: {
      posts: 15,
      upvotes: 720,
      followers: 198,
      following: 45,
    },
  },
};

// Mock User Posts
export const mockUserPosts: Record<string, MockUserPost[]> = {
  "user-001": [
    {
      id: "post-001",
      title:
        "วิเคราะห์แทคติค 4-3-3 ของ Man City ที่ทำให้พวกเขาครองบอลได้มากกว่า 70%",
      excerpt:
        "การใช้ False 9 และ Inverted Wingers ทำให้ Man City สามารถสร้างพื้นที่ในกลางสนามได้อย่างมีประสิทธิภาพ",
      thumbnail: "⚽",
      formation: "4-3-3",
      upvotes: 245,
      comments: 38,
      views: 1520,
      createdAt: "2024-03-15T10:30:00Z",
    },
    {
      id: "post-002",
      title: "ทำไม Arsenal ถึงใช้ Build-up แบบ 3-2-5 และมันได้ผลยังไง?",
      excerpt:
        "Arteta ปรับเปลี่ยนวิธีการเล่นจากหลังด้วยการให้ Fullback เข้ามาเป็น Inverted",
      thumbnail: "🎨",
      formation: "4-3-3 → 3-2-5",
      upvotes: 189,
      comments: 27,
      views: 980,
      createdAt: "2024-03-14T15:20:00Z",
    },
  ],
  "user-002": [
    {
      id: "post-002",
      title: "ทำไม Arsenal ถึงใช้ Build-up แบบ 3-2-5 และมันได้ผลยังไง?",
      excerpt:
        "Arteta ปรับเปลี่ยนวิธีการเล่นจากหลังด้วยการให้ Fullback เข้ามาเป็น Inverted",
      thumbnail: "🎨",
      formation: "4-3-3 → 3-2-5",
      upvotes: 189,
      comments: 27,
      views: 980,
      createdAt: "2024-03-14T15:20:00Z",
    },
  ],
  "user-003": [
    {
      id: "post-003",
      title:
        "การกดตัวสูงของ Liverpool: High Press ที่มีประสิทธิภาพที่สุดในยุโรป",
      excerpt:
        "Klopp ใช้ระบบ Gegenpressing ที่ทำให้ Liverpool สามารถกดเอาบอลคืนภายใน 5 วินาทีหลังเสียบอล",
      thumbnail: "🔥",
      formation: "4-3-3",
      upvotes: 312,
      comments: 45,
      views: 1850,
      createdAt: "2024-03-13T09:15:00Z",
    },
  ],
};

// Mock Current User (for settings)
export const mockCurrentUser: MockUser = mockUsers["tactical-genius"];

// Mock User Settings
export const mockUserSettings: MockUserSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    upvoteNotifications: false,
  },
  privacy: {
    showEmail: false,
    showLocation: true,
    allowMessages: true,
  },
  preferences: {
    language: "th",
    theme: "auto",
  },
};

// Helper functions
export function getUserByUsername(username: string): MockUser | undefined {
  return mockUsers[username];
}

export function getUserPosts(userId: string): MockUserPost[] {
  return mockUserPosts[userId] || [];
}

export function getCurrentUser(): MockUser {
  return mockCurrentUser;
}

export function getUserSettings(): MockUserSettings {
  return mockUserSettings;
}
