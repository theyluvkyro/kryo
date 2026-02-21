import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", page: "Home" },
  { label: "TV Shows", page: "TVShows" },
  { label: "Movies", page: "Movies" },
  { label: "Browse", page: "Browse" },
];

export default function Layout({ children, currentPageName }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on Watch page
  if (currentPageName === "Watch") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <style>{`
        :root {
          --netflix-red: #E50914;
        }
        body {
          background: #141414;
          overflow-x: hidden;
        }
        * {
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-12 py-3">
          {/* Left */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex-shrink-0">
              <span className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                KYRO
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`text-sm transition ${
                    currentPageName === item.page
                      ? "text-white font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl("Search")}
              className="text-white hover:text-gray-300 transition"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button className="text-white hover:text-gray-300 transition hidden md:block">
              <Bell className="w-5 h-5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#141414]/95 backdrop-blur-sm border-t border-gray-800 px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-sm transition ${
                  currentPageName === item.page
                    ? "text-white font-bold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="px-4 md:px-12 py-12 text-gray-500 text-xs">
        <div className="max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <p className="hover:text-gray-300 cursor-pointer">Audio Description</p>
              <p className="hover:text-gray-300 cursor-pointer">Investor Relations</p>
              <p className="hover:text-gray-300 cursor-pointer">Legal Notices</p>
            </div>
            <div className="space-y-2">
              <p className="hover:text-gray-300 cursor-pointer">Help Centre</p>
              <p className="hover:text-gray-300 cursor-pointer">Jobs</p>
              <p className="hover:text-gray-300 cursor-pointer">Cookie Preferences</p>
            </div>
            <div className="space-y-2">
              <p className="hover:text-gray-300 cursor-pointer">Gift Cards</p>
              <p className="hover:text-gray-300 cursor-pointer">Terms of Use</p>
              <p className="hover:text-gray-300 cursor-pointer">Corporate Information</p>
            </div>
            <div className="space-y-2">
              <p className="hover:text-gray-300 cursor-pointer">Media Centre</p>
              <p className="hover:text-gray-300 cursor-pointer">Privacy</p>
              <p className="hover:text-gray-300 cursor-pointer">Contact Us</p>
            </div>
          </div>
          <p className="text-gray-600">© 2026 Streaming App</p>
        </div>
      </footer>
    </div>
  );
}