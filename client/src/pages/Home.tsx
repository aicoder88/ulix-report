import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { LazyImage } from "@/components/LazyImage";
import { QuickJumpDialog } from "@/components/QuickJumpDialog";
import { SourceAtlasDialog } from "@/components/SourceAtlasDialog";
import { SourceExperiencePanel } from "@/components/SourceExperiencePanel";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Globe,
  Network,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { siteContent, navigationItems } from "@/lib/content";
import { canTrackReportEvents, trackReportEvent } from "@/lib/analytics";
import { withBase } from "@/lib/assets";
import {
  buildSearchEntries,
  formatAtlasHash,
  getPdfPageHref,
  parseReportHash,
} from "@/lib/report";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const iconMap: Record<string, ElementType> = {
  TrendingUp,
  Users,
  Globe,
  Zap,
  Network,
  Award,
  BookOpen,
};

const sectionIds = navigationItems.map(item => item.id);
const atlasItemsByPage = new Map(
  siteContent.sourceAtlas.map(item => [item.page, item] as const)
);
const searchEntries = buildSearchEntries();

type SourceAtlasItem = (typeof siteContent.sourceAtlas)[number];

function SectionHeader({
  accent,
  title,
  subtitle,
  invert = false,
}: {
  accent: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
      className="mb-6 text-center"
    >
      <motion.p
        variants={fadeInUp}
        className={`brief-kicker mb-2 ${invert ? "text-primary" : "text-primary"}`}
      >
        {accent}
      </motion.p>
      <motion.h2
        variants={fadeInUp}
        className={`mx-auto mb-4 max-w-4xl font-extrabold ${invert ? "text-background" : "text-foreground"
          }`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className={`mx-auto max-w-3xl leading-relaxed ${invert ? "text-background/72" : "text-muted-foreground"
            }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function SectionCue({
  label,
  targetLabel,
  onClick,
  invert = false,
}: {
  label: string;
  targetLabel: string;
  onClick: () => void;
  invert?: boolean;
}) {
  return (
    <div
      className={`mt-6 flex items-center justify-between gap-4 border-t pt-4 ${invert ? "border-background/12" : "border-border/80"
        }`}
    >
      <p
        className={`text-lg leading-relaxed ${invert ? "text-background/68" : "text-muted-foreground"
          }`}
      >
        {label}
      </p>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold ${invert
          ? "bg-background text-foreground"
          : "border border-primary/20 text-primary hover:bg-primary/5"
          }`}
      >
        {targetLabel}
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("preface");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [selectedAtlasItem, setSelectedAtlasItem] =
    useState<SourceAtlasItem | null>(null);
  const trackedSectionsRef = useRef(new Set<string>());
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    setSelectedAtlasItem(null);
    const el = document.getElementById(id);
    if (el) {
      const top = Math.max(el.offsetTop - 88, 0);
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
    setActiveNav(id);
    setMobileMenuOpen(false);
  };

  const openAtlasPage = (page: number) => {
    const atlasItem = atlasItemsByPage.get(page);
    if (!atlasItem) {
      return;
    }

    setActiveNav("proof");
    setSelectedAtlasItem(atlasItem);
  };

  const handleSearchSelection = (entry: (typeof searchEntries)[number]) => {
    if (entry.type === "section") {
      scrollToSection(entry.sectionId);
      return;
    }

    openAtlasPage(entry.page);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (
          el &&
          scrollPos >= el.offsetTop &&
          scrollPos < el.offsetTop + el.offsetHeight
        ) {
          setActiveNav(current => (current === id ? current : id));
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const { sectionId, atlasPage } = parseReportHash(window.location.hash);

      if (atlasPage) {
        setActiveNav("proof");
        setSelectedAtlasItem(atlasItemsByPage.get(atlasPage) ?? null);
        window.requestAnimationFrame(() => {
          const el = document.getElementById("proof");
          if (el) {
            window.scrollTo({ top: Math.max(el.offsetTop - 88, 0) });
          }
        });
        return;
      }

      if (sectionId && sectionIds.includes(sectionId)) {
        setSelectedAtlasItem(null);
        setActiveNav(sectionId);
        window.requestAnimationFrame(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            window.scrollTo({ top: Math.max(el.offsetTop - 88, 0) });
          }
        });
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const handleQuickJumpShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuickJumpOpen(current => !current);
        return;
      }

      if (event.key === "/" && !isEditable) {
        event.preventDefault();
        setQuickJumpOpen(true);
      }
    };

    window.addEventListener("keydown", handleQuickJumpShortcut);
    return () => window.removeEventListener("keydown", handleQuickJumpShortcut);
  }, []);

  useEffect(() => {
    if (selectedAtlasItem) {
      const nextHash = formatAtlasHash(selectedAtlasItem.page);
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
      return;
    }

    if (!activeNav) {
      return;
    }

    const nextHash = `#${activeNav}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [activeNav, selectedAtlasItem]);

  useEffect(() => {
    if (!canTrackReportEvents() || !activeNav) {
      return;
    }

    if (!trackedSectionsRef.current.has(activeNav)) {
      trackedSectionsRef.current.add(activeNav);
      trackReportEvent("report_section_view", { section: activeNav });
    }
  }, [activeNav]);

  useEffect(() => {
    if (!selectedAtlasItem) {
      return;
    }

    trackReportEvent("report_source_open", {
      page: selectedAtlasItem.page,
      title: selectedAtlasItem.title,
      section: selectedAtlasItem.section,
    });
  }, [selectedAtlasItem]);

  const handlePdfOpen = (page?: number, surface?: string) => {
    trackReportEvent("report_pdf_open", {
      page: page ?? null,
      surface: surface ?? "unknown",
    });
  };

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const heroParallax = prefersReducedMotion ? 0 : yParallax;
  const heroSnapshotMetrics = siteContent.keyMetrics.slice(0, 4);
  const openingStoryImages = siteContent.businessReview.sections.slice(0, 4);
  const platformProofItems = siteContent.sourceAtlas.filter(item =>
    siteContent.transformationNarrative.platform.sectionProofPages.includes(
      item.page
    )
  );
  const roadmapProofPages =
    siteContent.transformationNarrative.roadmap.sectionProofPages;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <motion.div
          className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-primary via-accent to-primary"
          style={{ scaleX: scrollYProgress }}
        />

        <header>
          <nav
            aria-label="Section navigation"
            className="fixed top-1 z-50 w-full border-b border-border bg-background/82 shadow-sm backdrop-blur-md transition-all duration-300"
          >
            <div className="container flex h-14 items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                className="min-w-0"
              >
                <p className="truncate text-xl font-extrabold text-foreground">
                  ULIX / TMC
                </p>
                <p className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  AI transformation report
                </p>
              </motion.div>
              <div className="hidden items-center gap-2 overflow-x-auto lg:flex">
                <button
                  type="button"
                  onClick={() => setQuickJumpOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  aria-label="Open quick jump"
                >
                  <Search className="h-3.5 w-3.5" />
                  Quick jump
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    ⌘K
                  </span>
                </button>
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={
                      activeNav === item.id ? "location" : undefined
                    }
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${activeNav === item.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
              <button
                className="p-2 text-foreground lg:hidden"
                onClick={() => setMobileMenuOpen(value => !value)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label="Toggle section navigation"
              >
                ☰
              </button>
            </div>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  id="mobile-nav"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border bg-background/95 lg:hidden"
                >
                  <div className="container grid grid-cols-2 gap-2 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setQuickJumpOpen(true);
                      }}
                      className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-lg font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                    >
                      <Search className="h-4 w-4" />
                      Quick jump
                    </button>
                    {navigationItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        aria-current={
                          activeNav === item.id ? "location" : undefined
                        }
                        className={`rounded-lg px-3 py-2 text-left text-lg font-medium ${activeNav === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </header>

        <main id="main-content">
          <section
            id="preface"
            className="relative flex min-h-[90vh] items-center overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-background to-primary/5 pb-8 pt-12 md:pb-12 md:pt-16"
          >
            <motion.div
              style={{ y: heroParallax }}
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
              <div className="absolute right-[-10%] top-[-10%] h-[52rem] w-[52rem] -rotate-12 rounded-full bg-primary/18 blur-[160px]" />
              <div className="absolute bottom-[-5%] left-[-5%] h-[44rem] w-[44rem] rounded-full bg-accent/18 blur-[140px]" />

              {/* Added large background hero image */}
              <div className="absolute right-0 top-0 h-full w-full opacity-[0.14] mix-blend-overlay">
                <LazyImage
                  src={siteContent.hero.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
            <div className="container relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid items-center gap-10 xl:grid-cols-[1.12fr_0.88fr]"
              >
                <div className="max-w-4xl">
                  <motion.div
                    variants={fadeInUp}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-lg font-bold text-primary shadow-sm"
                  >
                    {siteContent.preface.badge}
                  </motion.div>
                  <motion.p
                    variants={fadeInUp}
                    className="brief-kicker mb-2 text-accent"
                  >
                    Inspiring preface
                  </motion.p>
                  <motion.h1
                    variants={fadeInUp}
                    className="mb-6 max-w-4xl font-extrabold leading-[0.97] tracking-tight"
                  >
                    <span className="text-foreground">
                      {siteContent.preface.title}
                    </span>
                  </motion.h1>
                  <motion.p
                    variants={fadeInUp}
                    className="mb-5 max-w-3xl font-medium leading-relaxed text-muted-foreground"
                  >
                    {siteContent.preface.subtitle}
                  </motion.p>
                  <motion.p
                    variants={fadeInUp}
                    className="mb-4 max-w-3xl text-foreground/80"
                  >
                    {siteContent.preface.description}
                  </motion.p>
                  <motion.div
                    variants={fadeInUp}
                    className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 18px 48px rgba(15,118,110,0.24)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => scrollToSection("urgency")}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
                    >
                      {siteContent.preface.ctaLabel}
                      <ChevronDown className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection("roadmap")}
                      className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-primary/20 bg-background/70 px-8 py-4 text-lg font-bold text-primary hover:bg-primary/5"
                    >
                      See the roadmap
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={getPdfPageHref()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handlePdfOpen(undefined, "preface")}
                      className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-border bg-background/60 px-8 py-4 text-lg font-bold text-foreground hover:bg-secondary/40"
                    >
                      Open original PDF
                    </motion.a>
                  </motion.div>
                  <motion.div
                    variants={staggerContainer}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {siteContent.preface.highlights.map(item => (
                      <motion.div
                        key={item}
                        variants={fadeInUp}
                        className="section-shell rounded-3xl p-4"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="text-lg leading-6 text-foreground/80">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-primary/8 via-background to-accent/8 p-5">
                      <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
                        Source anchor
                      </p>
                      <p className="text-lg leading-7 text-foreground/78">
                        {siteContent.meta.title} began as a workshop deck in{" "}
                        {siteContent.meta.date}. This edition reframes that source
                        as a current AI transformation narrative while keeping the
                        original proof public.
                      </p>
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {siteContent.meta.preparedBy}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {heroSnapshotMetrics.map(metric => {
                        const Icon = iconMap[metric.icon] || Zap;
                        return (
                          <div
                            key={metric.label}
                            className="rounded-3xl border border-border/70 bg-background/70 p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${metric.bg}`}
                              >
                                <Icon className={`h-5 w-5 ${metric.color}`} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                  {metric.label}
                                </p>
                                <p className="text-lg font-extrabold text-foreground">
                                  {metric.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  variants={fadeInUp}
                  className="section-shell rounded-[2rem] p-6 sm:p-8"
                >
                  <p className="brief-kicker mb-3 text-primary">
                    Management standard
                  </p>
                  <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                    {siteContent.preface.opening}
                  </h2>
                  <p className="mb-6 text-lg leading-8 text-foreground/80">
                    {siteContent.preface.pullQuote}
                  </p>
                  <div className="mb-4 rounded-[1.5rem] border border-primary/15 bg-primary/6 px-5 py-5">
                    <p className="brief-kicker mb-2 text-primary">Next move</p>
                    <p className="text-lg leading-7 text-foreground/82">
                      {siteContent.preface.nextStep}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1.3fr_0.7fr]">
                    <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-secondary/30 shadow-2xl transition-transform hover:scale-[1.02]">
                      <LazyImage
                        src={withBase("/images/hero_concept_v2.png")}
                        alt="ULIX's vision of the future travel agency"
                        className="h-[28rem] w-full object-cover md:h-[32rem]"
                      />
                    </div>
                    <div className="grid gap-4">
                      <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-secondary/30 shadow-xl transition-transform hover:scale-[1.02]">
                        <LazyImage
                          src={withBase("/images/tech_architecture.png")}
                          alt="ULIX technology architecture"
                          className="h-52 w-full object-cover md:h-[15.25rem]"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-secondary/30 shadow-xl transition-transform hover:scale-[1.02]">
                        <LazyImage
                          src={withBase("/images/travel_hub_community_v2.png")}
                          alt="ULIX travel and technology hub"
                          className="h-52 w-full object-cover md:h-[15.25rem]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section
            id="urgency"
            className="relative overflow-hidden bg-secondary/20 py-8 md:py-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Why Now"
                title={siteContent.transformationNarrative.urgency.title}
                subtitle={siteContent.transformationNarrative.urgency.subtitle}
              />
              <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-6">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                    className="section-shell rounded-[2rem] p-7"
                  >
                    <p className="brief-kicker mb-3 text-primary">Lead</p>
                    <h3 className="mb-4 text-3xl font-extrabold text-foreground">
                      {siteContent.transformationNarrative.urgency.lead}
                    </h3>
                    <div className="space-y-4">
                      {siteContent.transformationNarrative.urgency.facts.map(
                        fact => (
                          <div
                            key={fact}
                            className="rounded-2xl border border-border/70 bg-background/72 p-5"
                          >
                            <p className="text-lg leading-8 text-foreground/82">
                              {fact}
                            </p>
                          </div>
                        )
                      )}
                      <div className="mt-8 overflow-hidden rounded-[2rem] border border-border/70 bg-secondary/30 shadow-2xl transition-transform hover:scale-[1.01]">
                        <LazyImage
                          src={siteContent.transformationNarrative.urgency.image!}
                          alt="AI Copilot helping agents"
                          className="h-80 w-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-foreground px-5 py-5 text-background">
                      <p className="brief-kicker mb-2 text-primary">
                        AI implication
                      </p>
                      <p className="text-lg leading-7 text-background/82">
                        {
                          siteContent.transformationNarrative.business
                            .aiImplication
                        }
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-primary/15 bg-primary/6 px-5 py-5">
                      <p className="brief-kicker mb-2 text-primary">
                        Next action
                      </p>
                      <p className="text-lg leading-7 text-foreground/80">
                        {
                          siteContent.transformationNarrative.business
                            .nextAction
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {siteContent.transformationNarrative.urgency.cards.map(
                      card => (
                        <motion.div
                          key={card.title}
                          variants={fadeInUp}
                          className="section-shell rounded-[1.75rem] p-5"
                        >
                          <p className="brief-kicker mb-3 text-primary">
                            {card.title}
                          </p>
                          <p className="text-xl leading-7 text-foreground/82">
                            {card.description}
                          </p>
                        </motion.div>
                      )
                    )}
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeInUp}
                    className="section-shell rounded-[2rem] p-7"
                  >
                    <p className="brief-kicker mb-3 text-accent">
                      Business narrative
                    </p>
                    <h3 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                      {siteContent.transformationNarrative.business.title}
                    </h3>
                    <p className="mb-8 max-w-3xl text-lg leading-8 text-foreground/80">
                      {siteContent.transformationNarrative.business.lead}
                    </p>
                    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {openingStoryImages.map(item => (
                        <div
                          key={`${item.year}-${item.heading}`}
                          className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/80 transition-all hover:shadow-2xl hover:scale-[1.02]"
                        >
                          <LazyImage
                            src={item.image}
                            alt={item.heading}
                            className="h-64 w-full object-cover md:h-72"
                          />
                          <div className="p-5">
                            <p className="brief-kicker mb-2 text-primary">
                              {item.year}
                            </p>
                            <p className="text-xl font-bold leading-7 text-foreground">
                              {item.heading}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {siteContent.transformationNarrative.business.pillars.map(
                        pillar => (
                          <div
                            key={pillar.title}
                            className="rounded-[1.5rem] border border-border/70 bg-background/74 p-5"
                          >
                            <p className="mb-2 text-lg font-bold text-foreground">
                              {pillar.title}
                            </p>
                            <p className="text-lg leading-7 text-foreground/78">
                              {pillar.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <SectionCue
                      label="The point of the story is not biography. It is to show why a system-first transformation is now possible."
                      targetLabel="Read the 14 commitments"
                      onClick={() => scrollToSection("commitments")}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="commitments"
            className="relative overflow-hidden bg-foreground py-8 text-background md:py-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/18 via-transparent to-transparent" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Deming In Plain Language"
                title={siteContent.operatingCommitments.title}
                subtitle={siteContent.operatingCommitments.subtitle}
                invert
              />
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeInUp}
                  className="section-shell-dark rounded-[2rem] p-7 lg:sticky lg:top-28 lg:self-start"
                >
                  <p className="brief-kicker mb-3 text-primary">
                    Operating standard
                  </p>
                  <h3 className="mb-4 text-3xl font-extrabold text-background">
                    Build quality into the company, not just into the copy.
                  </h3>
                  <p className="text-xl leading-8 text-background/78">
                    {siteContent.operatingCommitments.intro}
                  </p>
                  <div className="mt-6 rounded-[1.5rem] bg-primary/12 px-5 py-5">
                    <p className="brief-kicker mb-2 text-primary">Next move</p>
                    <p className="text-lg leading-7 text-background/82">
                      {siteContent.operatingCommitments.nextStep}
                    </p>
                  </div>
                  <SectionCue
                    label="Each commitment is meant to shape product decisions, leadership habits, training, and AI deployment choices."
                    targetLabel="See the platform"
                    onClick={() => scrollToSection("platform")}
                    invert
                  />

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {siteContent.operatingCommitments.items
                      .slice(0, 4)
                      .map(item => (
                        <motion.div
                          key={item.number}
                          variants={fadeInUp}
                          className="rounded-[1.75rem] border border-background/10 bg-background/6 p-5"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/16 text-lg font-extrabold text-primary">
                              {item.number}
                            </span>
                            <p className="text-lg font-bold text-background">
                              {item.title}
                            </p>
                          </div>
                          <p className="text-lg leading-7 text-background/78">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {siteContent.operatingCommitments.items
                    .slice(4)
                    .map(item => (
                      <motion.div
                        key={item.number}
                        variants={fadeInUp}
                        className="rounded-[1.75rem] border border-background/10 bg-background/6 p-5"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/16 text-lg font-extrabold text-primary">
                            {item.number}
                          </span>
                          <p className="text-lg font-bold text-background">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-lg leading-7 text-background/78">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                </motion.div>
              </div>
            </div>
          </section>

          <section
            id="platform"
            className="relative overflow-hidden bg-background py-8 md:py-12"
          >
            <div className="container">
              <SectionHeader
                accent="Platform Today"
                title={siteContent.transformationNarrative.platform.title}
                subtitle={siteContent.transformationNarrative.platform.subtitle}
              />
              <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  variants={fadeInUp}
                  className="section-shell rounded-[2rem] p-7"
                >
                  <p className="mb-6 text-lg leading-8 text-foreground/80">
                    {siteContent.transformationNarrative.platform.lead}
                  </p>
                  <div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="overflow-hidden rounded-[2.5rem] border border-border/70 shadow-2xl transition-transform hover:scale-[1.02]">
                      <LazyImage
                        src={siteContent.systemsOverview.image}
                        alt="ULIX systems architecture"
                        className="h-full min-h-[32rem] w-full object-cover"
                      />
                    </div>
                    <div className="grid gap-6">
                      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-secondary/30 shadow-xl transition-transform hover:scale-[1.02]">
                        <LazyImage
                          src={siteContent.travelHub.image}
                          alt="ULIX travel and technology hub"
                          className="h-64 w-full object-cover md:h-[15.55rem]"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-secondary/30 shadow-xl transition-transform hover:scale-[1.02]">
                        <LazyImage
                          src={siteContent.recommendationRoadmap.corporateImage}
                          alt="Corporate travel interface"
                          className="h-64 w-full object-cover md:h-[15.55rem]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] bg-foreground px-5 py-5 text-background">
                    <p className="brief-kicker mb-2 text-primary">
                      AI applied to the platform
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {siteContent.transformationNarrative.platform.aiApplications.map(
                        item => (
                          <span
                            key={item}
                            className="rounded-full bg-background/10 px-3 py-1.5 text-sm font-bold uppercase tracking-[0.14em] text-background/82"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-6 rounded-[1.75rem] border border-primary/15 bg-primary/6 px-5 py-5">
                    <p className="brief-kicker mb-2 text-primary">Next move</p>
                    <p className="text-lg leading-7 text-foreground/82">
                      {siteContent.transformationNarrative.platform.nextStep}
                    </p>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.12 }}
                    variants={staggerContainer}
                    className="grid gap-4"
                  >
                    {siteContent.transformationNarrative.platform.assets.map(
                      asset => (
                        <motion.div
                          key={asset.title}
                          variants={fadeInUp}
                          className="section-shell rounded-[1.75rem] p-5"
                        >
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold text-foreground">
                                {asset.title}
                              </p>
                              <p className="mt-2 text-lg leading-7 text-foreground/78">
                                {asset.description}
                              </p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold uppercase tracking-[0.14em] text-primary">
                              {asset.proof}
                            </span>
                          </div>
                        </motion.div>
                      )
                    )}
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.18 }}
                    variants={fadeInUp}
                    className="section-shell rounded-[2rem] p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="brief-kicker mb-2 text-primary">
                          Fast proof
                        </p>
                        <p className="text-xl leading-7 text-foreground/78">
                          Open the pages that show the platform is already real.
                        </p>
                      </div>
                      <a
                        href={getPdfPageHref()}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handlePdfOpen(undefined, "platform")}
                        className="rounded-full border border-primary/20 px-4 py-2 text-lg font-semibold text-primary hover:bg-primary/5"
                      >
                        Original PDF
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {platformProofItems.map(item => (
                        <button
                          key={item.page}
                          type="button"
                          onClick={() => openAtlasPage(item.page)}
                          className="rounded-full bg-primary/10 px-4 py-2 text-lg font-semibold text-primary hover:bg-primary/15"
                        >
                          Page {item.page} · {item.title}
                        </button>
                      ))}
                    </div>
                    <SectionCue
                      label="The platform exists. The next question is where waste is still slowing scale."
                      targetLabel="Show the friction"
                      onClick={() => scrollToSection("friction")}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="friction"
            className="relative overflow-hidden bg-foreground py-8 text-background md:py-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/18 via-transparent to-transparent" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Remove Waste"
                title={siteContent.transformationNarrative.friction.title}
                subtitle={siteContent.transformationNarrative.friction.subtitle}
                invert
              />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeInUp}
                className="mb-8 rounded-[2rem] border border-background/10 bg-background/6 p-7"
              >
                <p className="text-lg leading-8 text-background/82">
                  {siteContent.transformationNarrative.friction.lead}
                </p>
              </motion.div>
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {siteContent.transformationNarrative.friction.issues.map(
                    issue => (
                      <motion.div
                        key={issue.title}
                        variants={fadeInUp}
                        className="rounded-[1.75rem] border border-background/10 bg-background/6 p-5"
                      >
                        <p className="mb-2 text-xl font-bold text-background">
                          {issue.title}
                        </p>
                        <p className="mb-4 text-lg leading-7 text-background/76">
                          {issue.description}
                        </p>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                          Impact
                        </p>
                        <p className="mt-2 text-lg leading-7 text-background/84">
                          {issue.impact}
                        </p>
                      </motion.div>
                    )
                  )}
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeInUp}
                  className="section-shell-dark rounded-[2rem] p-7"
                >
                  <div className="mb-8 overflow-hidden rounded-[2.5rem] border border-background/20 bg-background/5 shadow-2xl transition-transform hover:scale-[1.01]">
                    <LazyImage
                      src={siteContent.transformationNarrative.friction.image!}
                      alt="Data flowing through a smart filter"
                      className="h-72 w-full object-cover md:h-80"
                    />
                  </div>
                  <p className="brief-kicker mb-3 text-primary">Do next</p>
                  <h3 className="mb-4 text-3xl font-extrabold text-background">
                    AI should start where work repeats and quality matters.
                  </h3>
                  <div className="space-y-3">
                    {siteContent.transformationNarrative.friction.opportunities.map(
                      item => (
                        <div
                          key={item}
                          className="rounded-[1.25rem] border border-background/10 bg-background/4 p-4"
                        >
                          <p className="text-lg leading-7 text-background/80">
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-6 rounded-[1.5rem] bg-primary/12 px-5 py-5">
                    <p className="brief-kicker mb-2 text-primary">
                      Operator note
                    </p>
                    <p className="text-lg leading-7 text-background/82">
                      {siteContent.transformationNarrative.friction.nextAction}
                    </p>
                  </div>
                  <SectionCue
                    label="The roadmap should free capacity first, then automate more of the system, then strengthen decisions, then scale the partner model."
                    targetLabel="Read the roadmap"
                    onClick={() => scrollToSection("roadmap")}
                    invert
                  />
                </motion.div>
              </div>
            </div>
          </section>

          <section
            id="roadmap"
            className="relative overflow-hidden bg-secondary/25 py-8 md:py-12"
          >
            <div className="container">
              <SectionHeader
                accent="Roadmap"
                title={siteContent.transformationNarrative.roadmap.title}
                subtitle={siteContent.transformationNarrative.roadmap.subtitle}
              />
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {siteContent.transformationNarrative.roadmap.phases.map(
                  phase => (
                    <span
                      key={phase.label}
                      className="rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] text-foreground/70"
                    >
                      {phase.label}
                    </span>
                  )
                )}
              </div>
              <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeInUp}
                  className="section-shell rounded-[2rem] p-7 lg:sticky lg:top-28 lg:self-start"
                >
                  <p className="brief-kicker mb-3 text-primary">What matters</p>
                  <h3 className="mb-4 text-3xl font-extrabold text-foreground">
                    {siteContent.transformationNarrative.roadmap.lead}
                  </h3>
                  <div className="rounded-[1.5rem] bg-foreground px-5 py-5 text-background">
                    <p className="brief-kicker mb-2 text-primary">
                      Platform lens
                    </p>
                    <p className="text-lg leading-7 text-background/82">
                      {
                        siteContent.transformationNarrative.roadmap
                          .partnerContext
                      }
                    </p>
                  </div>
                  <div className="mt-6 rounded-[1.5rem] border border-primary/15 bg-primary/6 px-5 py-5">
                    <p className="brief-kicker mb-2 text-primary">Next move</p>
                    <p className="text-lg leading-7 text-foreground/82">
                      {siteContent.transformationNarrative.roadmap.nextStep}
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="brief-kicker mb-3 text-primary">
                      Proof pages
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {roadmapProofPages.map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => openAtlasPage(page)}
                          className="rounded-full bg-primary/10 px-4 py-2 text-lg font-semibold text-primary hover:bg-primary/15"
                        >
                          Page {page}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-border/70 bg-secondary/30 shadow-2xl transition-transform hover:scale-[1.02]">
                    <LazyImage
                      src={siteContent.recommendationRoadmap.image}
                      alt="Ecosystem growth and roadmap illustration"
                      className="h-80 w-full object-cover md:h-[28rem]"
                    />
                  </div>
                  <SectionCue
                    label="This roadmap only matters if readers can verify it fast. The next section keeps the original proof visible."
                    targetLabel="Open the proof layer"
                    onClick={() => scrollToSection("proof")}
                  />
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {siteContent.transformationNarrative.roadmap.phases.map(
                    phase => (
                      <motion.div
                        key={phase.name}
                        variants={fadeInUp}
                        className="section-shell rounded-[2rem] p-6"
                      >
                        <div className="mb-5 flex flex-col gap-3 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
                          <div>
                            <p className="brief-kicker mb-2 text-primary">
                              {phase.name}
                            </p>
                            <h3 className="text-3xl font-extrabold text-foreground">
                              {phase.label}
                            </h3>
                          </div>
                          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
                            {phase.horizon}
                          </span>
                        </div>
                        <p className="mb-5 text-xl leading-8 text-foreground/80">
                          {phase.summary}
                        </p>
                        <div className="grid gap-3">
                          {phase.items.map(item => (
                            <div
                              key={item}
                              className="rounded-[1.5rem] border border-border/70 bg-background/74 p-4"
                            >
                              <p className="text-lg leading-7 text-foreground/82">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          <section
            id="proof"
            className="relative overflow-hidden bg-background py-8 md:py-12"
          >
            <div className="container">
              <SectionHeader
                accent="Proof Layer"
                title={siteContent.proofLayer.title}
                subtitle={siteContent.proofLayer.description}
              />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeInUp}
                className="mb-10 rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/7 via-background to-accent/8 p-7"
              >
                <p className="mx-auto max-w-4xl text-center text-lg leading-8 text-foreground/80">
                  {siteContent.proofLayer.narrative}
                </p>
                <div className="mx-auto mt-6 max-w-4xl rounded-[1.5rem] border border-primary/15 bg-background/80 px-5 py-5">
                  <p className="brief-kicker mb-2 text-primary">Next move</p>
                  <p className="text-lg leading-7 text-foreground/82">
                    {siteContent.proofLayer.nextStep}
                  </p>
                </div>
              </motion.div>

              <SourceExperiencePanel
                onJumpToSection={scrollToSection}
                onOpenPdf={handlePdfOpen}
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                variants={staggerContainer}
                className="mt-10 grid gap-5 lg:grid-cols-2"
              >
                {siteContent.sourceAtlas.map(item => (
                  <motion.article
                    key={item.page}
                    variants={fadeInUp}
                    className="section-shell overflow-hidden rounded-[2rem]"
                  >
                    <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
                      <div className="border-b border-border/70 bg-secondary/30 md:border-b-0 md:border-r">
                        <LazyImage
                          src={item.image}
                          alt={`${item.title} from page ${item.page}`}
                          className="h-80 w-full object-cover object-top md:h-full md:min-h-[27rem]"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                            Proof page {item.page}
                          </span>
                          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {item.section}
                          </span>
                        </div>
                        <h3 className="mb-3 text-2xl font-extrabold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mb-4 text-lg leading-7 text-foreground/78">
                          {item.summary}
                        </p>
                        <div className="mb-5 rounded-[1.25rem] bg-foreground px-4 py-4 text-background">
                          <p className="brief-kicker mb-2 text-primary">
                            Why it matters
                          </p>
                          <p className="text-lg leading-7 text-background/82">
                            {item.whyItMatters}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {item.bullets.slice(0, 2).map(bullet => (
                            <div
                              key={bullet}
                              className="rounded-[1.25rem] border border-border/70 bg-background/74 p-4"
                            >
                              <p className="text-lg leading-7 text-foreground/80">
                                {bullet}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => openAtlasPage(item.page)}
                            className="rounded-full bg-primary px-4 py-2 text-lg font-semibold text-primary-foreground"
                          >
                            Open proof page
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              scrollToSection(item.narrativeSectionId)
                            }
                            className="rounded-full border border-primary/20 px-4 py-2 text-lg font-semibold text-primary hover:bg-primary/5"
                          >
                            Back to narrative
                          </button>
                          <a
                            href={getPdfPageHref(item.page)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              handlePdfOpen(item.page, "proof-card")
                            }
                            className="rounded-full border border-border px-4 py-2 text-lg font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                          >
                            Open PDF page
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        <QuickJumpDialog
          open={quickJumpOpen}
          onOpenChange={setQuickJumpOpen}
          entries={searchEntries}
          onSelect={handleSearchSelection}
        />

        <SourceAtlasDialog
          item={selectedAtlasItem}
          onOpenChange={open => {
            if (!open) {
              setSelectedAtlasItem(null);
            }
          }}
          onJumpToSection={scrollToSection}
          onOpenPage={openAtlasPage}
          onOpenPdf={handlePdfOpen}
        />
      </div >
    </>
  );
}
