"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Thesis", href: "#thesis" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Founders", href: "#founders" },
];

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const SHOW_AFTER = 4800;
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isDark = scrolled;

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5"
        >
          <nav
            className={`mx-auto flex max-w-4xl items-center justify-between rounded-full border px-4 py-2.5 transition-colors duration-500 sm:px-6 ${
              isDark
                ? "border-white/10 bg-white/[0.04] backdrop-blur-2xl"
                : "border-neutral-200/60 bg-white/70 backdrop-blur-2xl"
            }`}
          >
            {/* Logo */}
            <a href="#" className="flex shrink-0 items-center gap-2">
              <Image
                src="/icon.png"
                alt=""
                width={28}
                height={28}
                className={`h-6 w-6 transition-all duration-500 sm:h-7 sm:w-7 ${isDark ? "invert brightness-200" : ""}`}
              />
              <span
                className={`hidden text-sm font-semibold tracking-tight transition-colors duration-500 sm:block ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Montlake
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                    isDark
                      ? "text-neutral-400 hover:bg-white/10 hover:text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <a
                href="mailto:partners@montlake.vc"
                className={`hidden rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors duration-300 sm:block ${
                  isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                Get in Touch
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${
                  isDark
                    ? "text-neutral-400 hover:bg-white/10"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {mobileOpen ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={`mx-auto mt-2 max-w-4xl overflow-hidden rounded-2xl border backdrop-blur-2xl md:hidden ${
                  isDark
                    ? "border-white/10 bg-neutral-900/90"
                    : "border-neutral-200/60 bg-white/90"
                }`}
              >
                <div className="flex flex-col p-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isDark
                          ? "text-neutral-300 active:bg-white/10"
                          : "text-neutral-700 active:bg-neutral-100"
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="mailto:partners@montlake.vc"
                    onClick={() => setMobileOpen(false)}
                    className={`mt-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      isDark
                        ? "bg-white/10 text-white active:bg-white/20"
                        : "bg-neutral-900 text-white active:bg-neutral-800"
                    }`}
                  >
                    Get in Touch
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
