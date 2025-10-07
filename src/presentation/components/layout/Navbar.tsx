"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure UI is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "หน้าแรก", icon: "🏠" },
    { href: "/matches", label: "ผลบอลสด", icon: "⚽" },
    { href: "/leagues", label: "ตารางคะแนน", icon: "🏆" },
    { href: "/tactics", label: "วิเคราะห์แทคติค", icon: "🎨" },
    { href: "/fantasy", label: "Fantasy", icon: "⭐" },
    { href: "/explore", label: "สำรวจ", icon: "🔍" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl lg:text-3xl">⚽</span>
            <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
              <span className="hidden sm:inline">Soccer</span>
              <span className="sm:hidden">ST</span>
              <span className="text-green-600 hidden sm:inline">Tactics</span>
            </span>
          </Link>

          {/* Desktop Navigation - Full menu */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Tablet/Desktop Navigation - Icon Only */}
          <div className="hidden lg:flex xl:hidden items-center space-x-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {/* Search Bar - Responsive width */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา..."
                className="w-28 xl:w-48 px-2.5 py-1.5 pl-8 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="absolute left-2 top-2 text-gray-400 text-sm">🔍</span>
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted ? (
                <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
              ) : (
                <span className="w-5 h-5 inline-block"></span>
              )}
            </button>

            {/* User Menu - Icon only on smaller screens */}
            <Link
              href="/profile/tactical-genius"
              title="โปรไฟล์"
              className="flex items-center space-x-1.5 px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">👤</span>
              <span className="hidden xl:inline text-sm">โปรไฟล์</span>
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle (Mobile) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted ? (
                theme === "dark" ? "🌙" : "☀️"
              ) : (
                <span className="w-6 h-6"></span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="text-2xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 pt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหา..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </form>

              {/* Mobile User Menu */}
              <div className="px-4 pt-2">
                <Link
                  href="/profile/tactical-genius"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <span>โปรไฟล์</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
