"use client";

import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function RulesView() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            กฎและวิธีเล่น
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            เรียนรู้วิธีเล่น Fantasy Football และกฎการให้คะแนน
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-2xl font-bold">เริ่มต้นอย่างรวดเร็ว</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">1</div>
              <h3 className="font-semibold mb-1">เลือกนักเตะ</h3>
              <p className="text-sm text-white/80">
                เลือกนักเตะ 15 คน ภายในงบ £100m
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">2</div>
              <h3 className="font-semibold mb-1">ตั้งกัปตัน</h3>
              <p className="text-sm text-white/80">
                เลือกกัปตันที่ได้คะแนน 2 เท่า
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">3</div>
              <h3 className="font-semibold mb-1">ย้ายนักเตะ</h3>
              <p className="text-sm text-white/80">
                ย้ายฟรี 1 ครั้งต่อสัปดาห์
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">4</div>
              <h3 className="font-semibold mb-1">แข่งขัน</h3>
              <p className="text-sm text-white/80">
                แข่งกับเพื่อนและผู้เล่นทั่วโลก
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* How to Play */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  วิธีเล่น
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    การเลือกทีม
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>เลือกนักเตะ 15 คน จาก Premier League</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>งบประมาณ £100 ล้าน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>ผู้รักษาประตู 2 คน, กองหลัง 5 คน, กองกลาง 5 คน, กองหน้า 3 คน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>เลือกนักเตะจากทีมเดียวกันได้สูงสุด 3 คน</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    การตั้งทีม
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>เลือกนักเตะลงสนาม 11 คน ตามฟอร์เมชั่น</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>นักเตะสำรอง 4 คน (1 GK, 3 ตำแหน่งอื่น)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>ตั้งกัปตัน (C) - ได้คะแนน 2 เท่า</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>ตั้งรองกัปตัน (V) - ใช้เมื่อกัปตันไม่ลงเล่น</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    การย้ายนักเตะ
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>ย้ายฟรี 1 ครั้งต่อ Gameweek</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>การย้ายเพิ่มเติม -4 คะแนนต่อครั้ง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>สิทธิ์ย้ายฟรีสะสมได้สูงสุด 2 ครั้ง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>ต้องทำการย้ายก่อน Deadline ของ Gameweek</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Scoring System */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ระบบการให้คะแนน
                </h2>
              </div>

              <div className="space-y-6">
                {/* Goalkeepers & Defenders */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    ผู้รักษาประตู & กองหลัง
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ScoringRow label="ลงเล่น" points={2} />
                    <ScoringRow label="เล่นครบ 60 นาที" points={2} />
                    <ScoringRow label="ทำประตู" points={6} />
                    <ScoringRow label="แอสซิสต์" points={3} />
                    <ScoringRow label="คลีนชีท" points={4} />
                    <ScoringRow label="เซฟ 3 ครั้ง" points={1} />
                    <ScoringRow label="เสียประตู 2 ลูก" points={-1} negative />
                    <ScoringRow label="เสียจุดโทษ" points={-2} negative />
                  </div>
                </div>

                {/* Midfielders */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    กองกลาง
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ScoringRow label="ลงเล่น" points={2} />
                    <ScoringRow label="เล่นครบ 60 นาที" points={2} />
                    <ScoringRow label="ทำประตู" points={5} />
                    <ScoringRow label="แอสซิสต์" points={3} />
                    <ScoringRow label="คลีนชีท" points={1} />
                    <ScoringRow label="เสียจุดโทษ" points={-2} negative />
                  </div>
                </div>

                {/* Forwards */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    กองหน้า
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ScoringRow label="ลงเล่น" points={2} />
                    <ScoringRow label="เล่นครบ 60 นาที" points={2} />
                    <ScoringRow label="ทำประตู" points={4} />
                    <ScoringRow label="แอสซิสต์" points={3} />
                    <ScoringRow label="เสียจุดโทษ" points={-2} negative />
                  </div>
                </div>

                {/* Bonus & Penalties */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    โบนัสและบทลงโทษ
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ScoringRow label="โบนัสคะแนน" points="1-3" />
                    <ScoringRow label="ใบเหลือง" points={-1} negative />
                    <ScoringRow label="ใบแดง" points={-3} negative />
                    <ScoringRow label="Own Goal" points={-2} negative />
                  </div>
                </div>
              </div>
            </section>

            {/* Chips */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Chips พิเศษ
                </h2>
              </div>

              <div className="space-y-4">
                <ChipCard
                  title="Wildcard"
                  description="ย้ายนักเตะได้ไม่จำกัดโดยไม่ถูกหักคะแนน"
                  usage="ใช้ได้ 2 ครั้งต่อฤดูกาล"
                  icon={<RefreshCw className="w-6 h-6 text-purple-600" />}
                />
                <ChipCard
                  title="Bench Boost"
                  description="นักเตะสำรองทั้ง 4 คนได้คะแนนเต็ม"
                  usage="ใช้ได้ 1 ครั้งต่อฤดูกาล"
                  icon={<Users className="w-6 h-6 text-blue-600" />}
                />
                <ChipCard
                  title="Triple Captain"
                  description="กัปตันได้คะแนน 3 เท่าแทน 2 เท่า"
                  usage="ใช้ได้ 1 ครั้งต่อฤดูกาล"
                  icon={<Trophy className="w-6 h-6 text-yellow-600" />}
                />
                <ChipCard
                  title="Free Hit"
                  description="เปลี่ยนทีมชั่วคราว 1 Gameweek"
                  usage="ใช้ได้ 1 ครั้งต่อฤดูกาล"
                  icon={<Sparkles className="w-6 h-6 text-green-600" />}
                />
              </div>
            </section>
          </div>

          {/* Sidebar - FAQ */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  คำถามที่พบบ่อย
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">💡 เคล็ดลับ</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>เลือกนักเตะที่มีตารางแข่งง่าย</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>ดูฟอร์มของนักเตะ 5 เกมล่าสุด</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>อย่าใช้ Chips เร็วเกินไป</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>ตั้งกัปตันที่มีโอกาสทำประตูสูง</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>เก็บเงินไว้สำหรับนักเตะราคาแพง</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ScoringRow({
  label,
  points,
  negative = false,
}: {
  label: string;
  points: number | string;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <span
        className={`font-bold ${
          negative
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {typeof points === "number" && points > 0 && !negative ? "+" : ""}
        {points}
      </span>
    </div>
  );
}

function ChipCard({
  title,
  description,
  usage,
  icon,
}: {
  title: string;
  description: string;
  usage: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {usage}
          </p>
        </div>
      </div>
    </div>
  );
}

// FAQ Data
const faqs = [
  {
    question: "เมื่อไหร่ที่ต้องตั้งทีม?",
    answer:
      "คุณต้องตั้งทีมก่อน Deadline ของแต่ละ Gameweek ซึ่งมักจะเป็นก่อนเกมแรกของสัปดาห์นั้น ประมาณ 1-2 ชั่วโมง",
  },
  {
    question: "ถ้านักเตะไม่ลงเล่นจะเกิดอะไรขึ้น?",
    answer:
      "ถ้านักเตะในทีมหลักไม่ลงเล่น ระบบจะแทนที่ด้วยนักเตะสำรองอัตโนมัติตามลำดับที่ตั้งไว้ โดยต้องเป็นไปตามกฎของฟอร์เมชั่น",
  },
  {
    question: "โบนัสคะแนนคำนวณอย่างไร?",
    answer:
      "โบนัสคะแนนจะให้กับนักเตะที่เล่นได้ดีที่สุด 3 อันดับแรกในแต่ละเกม โดยคำนวณจาก BPS (Bonus Points System) ซึ่งพิจารณาจากหลายปัจจัย",
  },
  {
    question: "สามารถเปลี่ยนกัปตันได้ไหม?",
    answer:
      "คุณสามารถเปลี่ยนกัปตันได้ตลอดเวลาก่อน Deadline ของ Gameweek แต่หลังจาก Deadline แล้วจะไม่สามารถเปลี่ยนได้",
  },
  {
    question: "ราคานักเตะเปลี่ยนแปลงเมื่อไหร่?",
    answer:
      "ราคานักเตะจะเปลี่ยนแปลงตามความต้องการ ถ้ามีคนซื้อมาก ราคาจะขึ้น ถ้ามีคนขายมาก ราคาจะลง การเปลี่ยนแปลงจะเกิดขึ้นทุกวัน",
  },
  {
    question: "Wildcard ใช้เมื่อไหร่ดีที่สุด?",
    answer:
      "แนะนำให้ใช้ Wildcard เมื่อทีมของคุณมีนักเตะบาดเจ็บหลายคน หรือต้องการปรับทีมใหม่ทั้งหมด โดยไม่ต้องเสียคะแนน",
  },
];
