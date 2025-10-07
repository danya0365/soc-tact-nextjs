"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ArrowLeftRight,
  BarChart3,
  Calendar,
  Trophy,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const fantasyNavItems = [
  { href: "/fantasy", label: "Dashboard", icon: Home },
  { href: "/fantasy/squad", label: "ทีม", icon: Users },
  { href: "/fantasy/transfers", label: "ย้าย", icon: ArrowLeftRight },
  { href: "/fantasy/points", label: "คะแนน", icon: BarChart3 },
  { href: "/fantasy/fixtures", label: "ตารางแข่ง", icon: Calendar },
  { href: "/fantasy/leagues", label: "ลีก", icon: Trophy },
  { href: "/fantasy/rules", label: "กฎ", icon: BookOpen },
];

export function FantasyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fantasy Navbar */}
      <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/fantasy"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Trophy className="w-6 h-6" />
              <span>Fantasy Football</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {fantasyNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Back to Main Site */}
            <Link
              href="/"
              className="hidden md:block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
            >
              กลับหน้าหลัก
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {fantasyNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>

      {/* Fantasy Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Fantasy Football</h3>
              <p className="text-gray-400 text-sm">
                เล่น Fantasy Football แบบมืออาชีพ
                วิเคราะห์ข้อมูลและสถิติครบถ้วน
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">เมนูหลัก</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/fantasy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fantasy/squad"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ทีมของฉัน
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fantasy/transfers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ซื้อ-ขายนักเตะ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fantasy/leagues"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ลีกของฉัน
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ช่วยเหลือ</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/fantasy/rules"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    กฎและวิธีเล่น
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    กลับหน้าหลัก
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2025 Soccer Tactics Fantasy Football. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
