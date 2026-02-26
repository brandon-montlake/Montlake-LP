"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Preloader } from "@/components/preloader";
import { Navbar } from "@/components/navbar";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/* ───────────────── Animated counter for stats ────────────────────── */

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView: boolean;
  delay?: number;
}) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => motionVal.set(value), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, motionVal, delay]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString());
    });
    return unsub;
  }, [springVal]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ───────────────── Horizontal line draw divider ──────────────────── */

function LineDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className="bg-[#111111] px-6">
      <motion.div
        className="mx-auto h-px max-w-3xl bg-white/10"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

const footerLinks = {
  company: [
    { id: "about", href: "#about", text: "About" },
    { id: "thesis", href: "#thesis", text: "Thesis" },
    { id: "contact", href: "mailto:partners@montlake.vc", text: "Contact" },
  ],
  connect: [
    {
      id: "linkedin",
      href: "https://linkedin.com",
      text: "LinkedIn",
      external: true,
    },
    {
      id: "email",
      href: "mailto:partners@montlake.vc",
      text: "Email Us",
    },
    {
      id: "angellist",
      href: "https://angellist.com/s/montlake/n0bZC",
      text: "AngelList Syndicate",
      external: true,
    },
  ],
};

const THESIS_TEXT =
  "We believe the best companies are built by founders who see what others can\u2019t. We back conviction over consensus, and move fast when it matters most.";
const THESIS_WORDS = THESIS_TEXT.split(" ");
const EMPHASIS_INDICES = new Set([8, 13, 16, 18, 20, 21]);

const steps = [
  {
    number: "01",
    title: "Source",
    description:
      "We identify high-signal deals through our AI-native pipeline and founder network.",
  },
  {
    number: "02",
    title: "Pool",
    description:
      "We structure a single-purpose SPV and rally our inner circle of co-investors.",
  },
  {
    number: "03",
    title: "Back",
    description:
      "Capital deploys fast. Founders get strategic partners, not just a check.",
  },
];

function useRevealOnScroll() {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);
}

/* ─────────────────── Thesis (inside the transition zone) ─────────── */

function ThesisContent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="thesis"
      className="relative bg-[#111111] px-6 py-28 sm:py-36 md:py-44"
    >
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <motion.span
          className="mb-8 block text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:mb-10 sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Our Thesis
        </motion.span>

        <p className="font-display text-[2rem] leading-[1.2] tracking-tight sm:text-[2.75rem] sm:leading-[1.2] md:text-[3.5rem] lg:text-[4.25rem] lg:leading-[1.15]">
          {THESIS_WORDS.map((word, i) => {
            const isEmphasis = EMPHASIS_INDICES.has(i);
            return (
              <motion.span
                key={i}
                className={`mr-[0.3em] inline-block ${isEmphasis ? "font-semibold italic text-white" : "text-neutral-200"}`}
                initial={{ opacity: 0, y: isEmphasis ? 24 : 16 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isEmphasis ? 24 : 16 }
                }
                transition={{
                  duration: isEmphasis ? 0.7 : 0.55,
                  delay: 0.3 + i * 0.07,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </p>

      </div>
    </section>
  );
}

/* ──────────────────────── About + Stats (dark) ──────────────────── */

const stats = [
  { numValue: 15, prefix: "", suffix: "", display: "15", label: "Checks per Year" },
  { numValue: null, prefix: "", suffix: "", display: "$50-100k", label: "Pooled per Deal" },
  { numValue: 0, prefix: "", suffix: "", display: "0", label: "Fees or Commitment" },
];

function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      className="relative bg-[#111111] px-6 py-24 sm:py-32 md:py-40"
    >
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <motion.h2
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:mb-10 sm:text-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          About Us
        </motion.h2>

        <motion.div
          className="blur-card mx-auto max-w-3xl rounded-3xl px-8 py-10 sm:px-12 sm:py-14"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.97 }
          }
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <p className="font-display text-xl leading-relaxed text-neutral-200 sm:text-2xl md:text-3xl lg:text-[2rem] lg:leading-[1.45]">
            Montlake is an AI-native syndicate that surfaces high-signal
            investment opportunities for our inner circle. We bridge the gap
            between elite founders and strategic capital, pooling funds into a
            single vehicle to back the next generation of category-definers.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

/* ─────────────────────────── How It Works ─────────────────────────── */

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(sectionProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-[#111111] px-6 py-24 sm:py-32 md:py-40"
    >
      <div ref={ref} className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 text-center sm:mb-20"
          style={{ y: headingY }}
        >
          <motion.span
            className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            How It Works
          </motion.span>
          <motion.h2
            className="font-display text-3xl tracking-tight text-neutral-200 italic sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          >
            From deal to deployment.
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="blur-card group relative overflow-hidden rounded-2xl px-7 py-8 sm:px-8 sm:py-10"
              initial={{ opacity: 0, y: 24 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.12,
                ease: EASE,
              }}
            >
              <motion.span
                className="font-display block text-5xl tracking-tight text-white/10 sm:text-6xl md:text-7xl"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={
                  isInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.7, opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.12,
                  ease: EASE,
                }}
              >
                {step.number}
              </motion.span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── For Founders CTA ─────────────────────── */

function FoundersCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress: ctaProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowScale = useTransform(ctaProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const glowOpacity = useTransform(ctaProgress, [0, 0.5, 1], [0, 1, 0.3]);

  return (
    <section
      ref={sectionRef}
      id="founders"
      className="relative overflow-hidden bg-[#111111] px-6 py-28 sm:py-36 md:py-44"
    >
      <motion.div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ scale: glowScale, opacity: glowOpacity }}
      >
        <div className="h-[300px] w-[500px] rounded-full bg-white/[0.03] blur-[120px]" />
      </motion.div>

      <div ref={ref} className="relative mx-auto max-w-3xl text-center">
        <motion.span
          className="mb-6 block text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:mb-8 sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          For Founders
        </motion.span>

        <motion.h2
          className="font-display text-3xl leading-tight tracking-tight text-neutral-200 sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.15]"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          Building something category-defining?
        </motion.h2>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:mt-6 sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          We back founders with conviction, speed, and zero bureaucracy. If
          you&apos;re raising and want partners who move as fast as you do, we
          want to hear from you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          className="mt-10 sm:mt-12"
        >
          <a
            href="mailto:founders@montlake.vc"
            className="blur-card inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/10 sm:py-3.5 sm:text-base"
          >
            Contact Us
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ Main Page ═══════════════════════════════ */

/* ─────────────────────────── Footer ───────────────────────────────── */

function FooterContent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  const columns = [
    { title: "Company", links: footerLinks.company },
    { title: "Connect", links: footerLinks.connect },
  ];

  return (
    <div ref={ref} className="mx-auto flex w-full max-w-6xl flex-col">
      <motion.div
        className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 invert brightness-200 sm:h-9 sm:w-9"
          />
          <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Montlake Ventures
          </span>
        </div>

        <a
          href="mailto:partners@montlake.vc"
          className="blur-card inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white active:bg-white/10 sm:py-2.5"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Get in Touch
        </a>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-8 sm:mt-16 lg:gap-12">
        {columns.map((col, i) => (
          <motion.div
            key={col.title}
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
            }
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: EASE }}
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {col.title}
            </h3>
            {col.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-sm text-neutral-400 transition-colors hover:text-white"
              >
                {link.text}
              </a>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 border-t border-white/10 pt-8 sm:mt-16"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-white active:bg-white/5"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          <span className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Montlake Ventures
          </span>
        </div>
      </motion.div>

      {/* Large wordmark -- clipped at bottom */}
      <div
        className="mt-10 max-h-[90px] overflow-hidden sm:mt-14 sm:max-h-[140px] md:max-h-[150px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, white 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, white 60%, transparent 100%)",
        }}
      >
        <Image
          src="/logo.png"
          alt="Montlake"
          width={1200}
          height={240}
          className="h-auto w-full max-w-5xl opacity-[0.15] invert brightness-200"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════ Main Page ═══════════════════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 0.8], [0, -60]);

  useRevealOnScroll();

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="relative">
        {/* ─── Hero Section (Light) ─── */}
        <section
          ref={heroRef}
          className="relative flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6"
        >
          {/* Background map */}
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{ backgroundImage: "url('/background.png')" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#fafafa_10%,_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 absolute bottom-0 h-32 bg-gradient-to-b from-transparent to-[#fafafa]" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 sm:gap-8"
            style={{ y: heroY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: 4.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ opacity: heroOpacity }}
            >
              <Image
                src="/logo.png"
                alt="Montlake Ventures"
                width={600}
                height={120}
                priority
                className="h-auto w-[280px] sm:w-[380px] md:w-[460px] lg:w-[540px]"
              />
            </motion.div>

            <motion.p
              className="font-display max-w-xl text-center text-xl leading-relaxed tracking-tight text-neutral-500 italic sm:text-2xl md:text-3xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 4.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ opacity: heroOpacity }}
            >
              A fully managed SPV writing $50–100k checks into the next generation of category-defining startups.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 5.0,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ opacity: heroOpacity }}
            >
              <a
                href="https://angellist.com/s/montlake/n0bZC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white/80 px-6 py-3 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition-all hover:border-neutral-400 hover:bg-white active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
              >
                Invest With Us
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 sm:bottom-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 5.4, ease: "easeOut" }}
            style={{ opacity: heroOpacity }}
          >
            <div
              className="flex flex-col items-center gap-2 text-neutral-400"
              style={{ animation: "bounce-subtle 2.5s ease-in-out infinite" }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Scroll
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </div>
          </motion.div>
        </section>

        {/* ─── Thesis ─── */}
        <ThesisContent />
        <LineDivider />

        {/* ─── Everything below is solid dark ─── */}
        <AboutSection />
        <LineDivider />
        <HowItWorksSection />
        <LineDivider />
        <FoundersCTA />

        {/* ─── Footer ─── */}
        <footer className="bg-[#111111] px-6 pb-0 pt-16 sm:pt-20 lg:pt-24">
          <FooterContent />
        </footer>
      </main>
    </>
  );
}
