"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "ผลบอลสด", href: "/matches" },
      { label: "ตารางคะแนน", href: "/leagues" },
      { label: "วิเคราะห์แทคติค", href: "/tactics" },
      { label: "สำรวจ", href: "/explore" },
    ],
    community: [
      { label: "นักวิเคราะห์", href: "/analysts" },
      { label: "บทความยอดนิยม", href: "/tactics?sort=popular" },
      { label: "แนวทางชุมชน", href: "/guidelines" },
      { label: "คำถามที่พบบ่อย", href: "/faq" },
    ],
    company: [
      { label: "เกี่ยวกับเรา", href: "/about" },
      { label: "ติดต่อเรา", href: "/contact" },
      { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
      { label: "เงื่อนไขการใช้งาน", href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: "📘", label: "Facebook", href: "#" },
    { icon: "🐦", label: "Twitter", href: "#" },
    { icon: "📷", label: "Instagram", href: "#" },
    { icon: "▶️", label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">⚽</span>
              <span className="text-xl font-bold text-white">
                Soccer<span className="text-green-500">Tactics</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล
              พร้อมระบบตารางคะแนนลีกและ Live Score
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-2xl hover:text-green-500 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">แพลตฟอร์ม</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ชุมชน</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">บริษัท</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">
              รับข่าวสารและบทวิเคราะห์ล่าสุด
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              สมัครรับจดหมายข่าวเพื่อไม่พลาดบทวิเคราะห์แทคติคใหม่ๆ
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              />
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                สมัคร
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {currentYear} SoccerTactics. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Made with ⚽ by{" "}
            <span className="text-green-500 font-semibold">Marosdee</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
