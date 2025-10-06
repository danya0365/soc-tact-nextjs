/**
 * Mock Data for Tactical Analysis Posts
 * Used for UI development before API integration
 */

export interface MockTacticalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  formation: string;
  league: string;
  team?: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  relatedMatch?: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    date: string;
  };
}

export interface MockComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies?: MockComment[];
}

// Mock Tactical Posts Data
export const mockTacticalPosts: MockTacticalPost[] = [
  {
    id: "post-001",
    title: "วิเคราะห์แทคติค 4-3-3 ของ Man City ที่ทำให้พวกเขาครองบอลได้มากกว่า 70%",
    slug: "man-city-433-possession-tactics",
    excerpt:
      "การใช้ False 9 และ Inverted Wingers ทำให้ Man City สามารถสร้างพื้นที่ในกลางสนามได้อย่างมีประสิทธิภาพ พร้อมวิเคราะห์รูปแบบการเล่นที่ทำให้พวกเขาครองบอลได้มากกว่า 70% ในทุกเกม",
    content: `# วิเคราะห์แทคติค 4-3-3 ของ Manchester City

## การใช้ False 9

Pep Guardiola ใช้ Haaland ในบทบาทที่แตกต่างจาก Striker ทั่วไป โดยให้เขาดรอปลงมารับบอลในพื้นที่ระหว่างกองกลางกับกองหน้า สร้างพื้นที่ว่างให้กับ Wingers วิ่งเข้าไปใช้ประโยชน์

## Inverted Wingers

- **Foden (ซ้าย)**: วิ่งเข้ามาตัดในด้วยขวา สร้างโอกาสยิงประตู
- **Bernardo Silva (ขวา)**: ดรอปลงมาเล่นในกลางสนาม สร้างความหนาแน่น

## Build-up Play

การเล่นจากหลังของ Man City เริ่มจาก:
1. Ederson แจกบอลสั้นให้ Center Backs
2. Rodri ดรอปลงมาเป็นตัวเชื่อม
3. Fullbacks เข้ามาในกลางสนาม
4. สร้างรูปแบบ 3-2-5 ในการโจมตี

## สรุป

รูปแบบการเล่นนี้ทำให้ Man City ครองบอลได้มากกว่า 70% และสร้างโอกาสได้มากกว่า 20 ครั้งต่อเกม`,
    thumbnail: "⚽",
    author: {
      id: "user-001",
      name: "Tactical Genius",
      avatar: "👨‍💼",
      bio: "นักวิเคราะห์แทคติคฟุตบอล ผู้เชี่ยวชาญด้าน Positional Play",
    },
    formation: "4-3-3",
    league: "Premier League",
    team: "Manchester City",
    tags: ["Possession", "False 9", "Build-up", "Inverted Wingers"],
    upvotes: 245,
    downvotes: 12,
    comments: 38,
    views: 1520,
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    relatedMatch: {
      id: "match-001",
      homeTeam: "Manchester City",
      awayTeam: "Arsenal",
      score: "2-1",
      date: "2024-03-16",
    },
  },
  {
    id: "post-002",
    title: "ทำไม Arsenal ถึงใช้ Build-up แบบ 3-2-5 และมันได้ผลยังไง?",
    slug: "arsenal-325-buildup-analysis",
    excerpt:
      "Arteta ปรับเปลี่ยนวิธีการเล่นจากหลังด้วยการให้ Fullback เข้ามาเป็น Inverted ทำให้มีตัวเลือกในการส่งบอลมากขึ้น และสามารถหลบกดดันของคู่ต่อสู้ได้อย่างมีประสิทธิภาพ",
    content: `# Arsenal's 3-2-5 Build-up System

## โครงสร้างพื้นฐาน

Arsenal เปลี่ยนจาก 4-3-3 เป็น 3-2-5 เมื่อมีบอล:
- White เข้ามาเป็น Inverted Fullback
- Zinchenko เล่นในกลางสนาม
- สร้างความหนาแน่นในการครองบอล

## ข้อดี

1. **Numerical Superiority**: มีผู้เล่นมากกว่าในกลางสนาม
2. **Progression**: ส่งบอลไปข้างหน้าได้ง่ายขึ้น
3. **Flexibility**: ปรับเปลี่ยนรูปแบบได้รวดเร็ว

## การป้องกัน Counter-attack

- Partey อยู่หน้า Back 3 เป็น Shield
- Rice ทำหน้าที่ Box-to-Box
- Transition รวดเร็วเมื่อเสียบอล`,
    thumbnail: "🎨",
    author: {
      id: "user-002",
      name: "Football Analyst",
      avatar: "🎯",
      bio: "วิเคราะห์แทคติคทีมชั้นนำ เชี่ยวชาญด้าน Build-up Play",
    },
    formation: "4-3-3 → 3-2-5",
    league: "Premier League",
    team: "Arsenal",
    tags: ["Build-up", "Inverted Fullback", "Positional Play"],
    upvotes: 189,
    downvotes: 8,
    comments: 27,
    views: 980,
    createdAt: "2024-03-14T15:20:00Z",
    updatedAt: "2024-03-14T15:20:00Z",
  },
  {
    id: "post-003",
    title: "การกดตัวสูงของ Liverpool: High Press ที่มีประสิทธิภาพที่สุดในยุโรป",
    slug: "liverpool-high-press-tactics",
    excerpt:
      "Klopp ใช้ระบบ Gegenpressing ที่ทำให้ Liverpool สามารถกดเอาบอลคืนภายใน 5 วินาทีหลังเสียบอล วิเคราะห์รูปแบบการกดดันและ Trigger ที่ใช้ในการเริ่มต้น Press",
    content: `# Liverpool's Gegenpressing System

## หลักการพื้นฐาน

Gegenpressing = กดดันทันทีหลังเสียบอล
- เวลา: ภายใน 5 วินาที
- พื้นที่: รัศมี 10 เมตรจากจุดเสียบอล
- จำนวนผู้เล่น: อย่างน้อย 3 คน

## Pressing Triggers

1. **Bad First Touch**: คู่ต่อสู้ควบคุมบอลไม่ดี
2. **Back Pass**: ส่งบอลกลับหาผู้รักษาประตู
3. **Wide Areas**: บอลอยู่ริมเส้น

## ตำแหน่งผู้เล่น

- **Salah**: กดดัน Left Back
- **Nunez**: กดดัน Center Backs
- **Diaz**: กดดัน Right Back
- **Midfielders**: ปิดช่องทางส่งบอล

## สถิติ

- กดเอาบอลคืนในพื้นที่โจมตี: 15 ครั้ง/เกม
- ยิงประตูจาก High Press: 35% ของประตูทั้งหมด`,
    thumbnail: "🔥",
    author: {
      id: "user-003",
      name: "Press Master",
      avatar: "⚡",
      bio: "ผู้เชี่ยวชาญด้าน Pressing และ Counter-pressing",
    },
    formation: "4-3-3",
    league: "Premier League",
    team: "Liverpool",
    tags: ["Gegenpressing", "High Press", "Counter-attack"],
    upvotes: 312,
    downvotes: 15,
    comments: 45,
    views: 1850,
    createdAt: "2024-03-13T09:15:00Z",
    updatedAt: "2024-03-13T09:15:00Z",
  },
  {
    id: "post-004",
    title: "Real Madrid's Counter-attacking Masterclass: จาก Defense สู่ Goal ใน 10 วินาที",
    slug: "real-madrid-counter-attack",
    excerpt:
      "วิเคราะห์รูปแบบการเล่นตอบโต้ของ Real Madrid ที่สามารถเปลี่ยนจากการป้องกันเป็นการโจมตีได้อย่างรวดเร็ว ด้วยความเร็วของ Vinicius และ Rodrygo",
    content: `# Real Madrid's Lightning Counter-attacks

## โครงสร้างการป้องกัน

Real Madrid ป้องกันด้วย 4-4-2 แบบ Compact:
- ระยะห่างระหว่างแนว: 10-15 เมตร
- กดดันในครึ่งแดนตัวเอง
- รอจังหวะ Transition

## Transition Moments

1. **Ball Recovery**: กดเอาบอลคืนในกลางสนาม
2. **Quick Release**: ส่งบอลไปข้างหน้าทันที
3. **Speed**: ใช้ความเร็วของ Wingers

## Key Players

- **Vinicius**: ความเร็ว + Dribbling
- **Rodrygo**: Movement + Finishing
- **Bellingham**: Late Run เข้าประตู
- **Modric/Kroos**: Long Pass Accuracy

## สถิติ

- เวลาเฉลี่ยจาก Defense → Goal: 8.5 วินาที
- ประตูจาก Counter-attack: 45% ของประตูทั้งหมด`,
    thumbnail: "⚪",
    author: {
      id: "user-004",
      name: "Counter Attack Pro",
      avatar: "⚡",
      bio: "เชี่ยวชาญด้าน Transition Play และ Counter-attacking",
    },
    formation: "4-4-2",
    league: "La Liga",
    team: "Real Madrid",
    tags: ["Counter-attack", "Transition", "Speed"],
    upvotes: 278,
    downvotes: 10,
    comments: 32,
    views: 1420,
    createdAt: "2024-03-12T14:45:00Z",
    updatedAt: "2024-03-12T14:45:00Z",
  },
  {
    id: "post-005",
    title: "Bayern Munich's Pressing Trap: วิธีล่อคู่ต่อสู้เข้ากับดัก",
    slug: "bayern-munich-pressing-trap",
    excerpt:
      "Tuchel ใช้กลยุทธ์ Pressing Trap ที่ชาญฉลาด ด้วยการเปิดพื้นที่ให้คู่ต่อสู้ส่งบอล แล้วกดดันทันทีเมื่อบอลถึงจุดที่ต้องการ",
    content: `# Bayern's Intelligent Pressing System

## Pressing Trap คืออะไร?

การเปิดพื้นที่ให้คู่ต่อสู้ส่งบอลไปยังจุดที่เราต้องการ แล้วกดดันทันที

## กลไกการทำงาน

1. **Bait**: เปิดช่องทางส่งบอล
2. **Trigger**: รอให้คู่ต่อสู้ส่งบอล
3. **Spring**: กดดันทันทีด้วยผู้เล่น 3-4 คน
4. **Win**: กดเอาบอลคืนในพื้นที่อันตราย

## ตัวอย่างการใช้งาน

- เปิดให้ส่งบอลไปที่ Fullback
- Kane และ Musiala วิ่งกดทันที
- Sane/Coman ปิดช่องทางส่งบอลกลับ
- Kimmich รอรับบอลที่กดได้

## ประสิทธิภาพ

- Ball Recovery ในพื้นที่โจมตี: 18 ครั้ง/เกม
- Conversion Rate: 28%`,
    thumbnail: "🔴",
    author: {
      id: "user-005",
      name: "Tactical Mind",
      avatar: "🧠",
      bio: "นักวิเคราะห์แทคติคระดับสูง เชี่ยวชาญ Pressing Systems",
    },
    formation: "4-2-3-1",
    league: "Bundesliga",
    team: "Bayern Munich",
    tags: ["Pressing Trap", "Tactical Fouling", "Ball Recovery"],
    upvotes: 195,
    downvotes: 7,
    comments: 23,
    views: 890,
    createdAt: "2024-03-11T11:20:00Z",
    updatedAt: "2024-03-11T11:20:00Z",
  },
];

// Mock Comments Data
export const mockComments: Record<string, MockComment[]> = {
  "post-001": [
    {
      id: "comment-001",
      postId: "post-001",
      author: {
        id: "user-101",
        name: "Football Fan",
        avatar: "⚽",
      },
      content:
        "วิเคราะห์ได้ดีมากครับ! อยากเห็นการวิเคราะห์เพิ่มเติมเกี่ยวกับการป้องกัน Counter-attack ของ Man City ด้วย",
      upvotes: 15,
      downvotes: 1,
      createdAt: "2024-03-15T11:00:00Z",
    },
    {
      id: "comment-002",
      postId: "post-001",
      author: {
        id: "user-102",
        name: "Tactics Expert",
        avatar: "🎯",
      },
      content:
        "เห็นด้วยกับการวิเคราะห์ครับ แต่คิดว่า Haaland ไม่ได้เล่นเป็น False 9 แบบเต็มตัว เขายังคงอยู่ในกรอบเป้าหมายเป็นหลัก",
      upvotes: 8,
      downvotes: 2,
      createdAt: "2024-03-15T12:30:00Z",
      replies: [
        {
          id: "comment-003",
          postId: "post-001",
          author: {
            id: "user-001",
            name: "Tactical Genius",
            avatar: "👨‍💼",
          },
          content:
            "ถูกต้องครับ Haaland ไม่ได้เล่นเป็น False 9 แบบ Messi แต่เขาก็มีการดรอปลงมารับบอลบ้างในบางสถานการณ์",
          upvotes: 12,
          downvotes: 0,
          createdAt: "2024-03-15T13:00:00Z",
        },
      ],
    },
  ],
};

// Helper functions
export function getTacticalPostById(id: string): MockTacticalPost | undefined {
  return mockTacticalPosts.find((post) => post.id === id);
}

export function getTacticalPostBySlug(
  slug: string
): MockTacticalPost | undefined {
  return mockTacticalPosts.find((post) => post.slug === slug);
}

export function getTacticalPostsByFormation(
  formation: string
): MockTacticalPost[] {
  return mockTacticalPosts.filter((post) => post.formation.includes(formation));
}

export function getTacticalPostsByLeague(league: string): MockTacticalPost[] {
  return mockTacticalPosts.filter((post) => post.league === league);
}

export function getTacticalPostsByTag(tag: string): MockTacticalPost[] {
  return mockTacticalPosts.filter((post) => post.tags.includes(tag));
}

export function getCommentsByPostId(postId: string): MockComment[] {
  return mockComments[postId] || [];
}

export function searchTacticalPosts(query: string): MockTacticalPost[] {
  const lowerQuery = query.toLowerCase();
  return mockTacticalPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
