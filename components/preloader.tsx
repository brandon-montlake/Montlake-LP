"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FULL_TEXT = "High-conviction bets in high-caliber startups.";
const HIGHLIGHT_START = 0;
const HIGHLIGHT_END = 21;
const TYPE_SPEED = 50;

function TypewriterText() {
  const [charCount, setCharCount] = useState(0);

  const tick = useCallback(() => {
    setCharCount((prev) => (prev < FULL_TEXT.length ? prev + 1 : prev));
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, TYPE_SPEED);
    return () => clearInterval(interval);
  }, [tick]);

  const displayed = FULL_TEXT.slice(0, charCount);
  const before = displayed.slice(0, HIGHLIGHT_START);
  const highlight = displayed.slice(HIGHLIGHT_START, HIGHLIGHT_END);
  const after = displayed.slice(HIGHLIGHT_END);
  const done = charCount >= FULL_TEXT.length;

  return (
    <h1 className="font-display relative max-w-3xl px-6 text-center text-3xl leading-[1.1] tracking-tight text-neutral-800 sm:text-5xl md:text-6xl lg:text-7xl">
      {before}
      <span className="text-neutral-400">{highlight}</span>
      {after}
      <motion.span
        className="ml-0.5 inline-block w-[2px] translate-y-[0.05em] bg-neutral-400 align-baseline sm:w-[3px]"
        style={{ height: "0.85em" }}
        animate={{ opacity: done ? [1, 0] : 1 }}
        transition={
          done
            ? { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
            : {}
        }
      />
    </h1>
  );
}

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const dismiss = FULL_TEXT.length * TYPE_SPEED + 1400;
    const timer = setTimeout(() => setShow(false), dismiss);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[var(--background)]"
          exit={{ y: "-100%", opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.6, 0.01, 0.05, 0.95],
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Image
              src="/icon.png"
              alt=""
              width={56}
              height={56}
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
          </motion.div>

          <TypewriterText />

          <motion.div
            className="relative mt-12 w-48 sm:mt-16 sm:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="h-px w-full bg-neutral-200">
              <motion.div
                className="h-full bg-neutral-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: FULL_TEXT.length * (TYPE_SPEED / 1000) + 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </div>
          </motion.div>

          <motion.p
            className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Montlake Ventures
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
