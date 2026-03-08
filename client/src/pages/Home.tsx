import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { LazyImage } from "@/components/LazyImage";
import { QuickJumpDialog } from "@/components/QuickJumpDialog";
import { SourceAtlasDialog } from "@/components/SourceAtlasDialog";
import { SourceExperiencePanel } from "@/components/SourceExperiencePanel";
import { StakeholderPaths } from "@/components/StakeholderPaths";
import {
  ChevronDown,
  Zap,
  Users,
  Rocket,
  TrendingUp,
  Globe,
  Code,
  Award,
  Database,
  Target,
  Smartphone,
  BookOpen,
  Headphones,
  MousePointer,
  Star,
  Briefcase,
  Network,
  CheckCircle,
  Search,
} from "lucide-react";
import { siteContent, navigationItems } from "@/lib/content";
import { canTrackReportEvents, trackReportEvent } from "@/lib/analytics";
import {
  buildSearchEntries,
  formatAtlasHash,
  getPdfPageHref,
  parseReportHash,
} from "@/lib/report";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const iconMap: Record<string, ElementType> = {
  TrendingUp,
  Users,
  Globe,
  Zap,
  Network,
  Award,
  Code,
  Database,
  Target,
  Smartphone,
  Star,
  Briefcase,
  Rocket,
  BookOpen,
  Headphones,
  MousePointer,
  CheckCircle,
};

const sectionIds = navigationItems.map(item => item.id);
const atlasItemsByPage = new Map(
  siteContent.sourceAtlas.map(item => [item.page, item] as const)
);
const searchEntries = buildSearchEntries();

function SectionHeader({
  accent,
  title,
  subtitle,
}: {
  accent: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="mb-16 text-center"
    >
      <motion.p
        variants={fadeInUp}
        className="brief-kicker mb-4 text-primary"
      >
        {accent}
      </motion.p>
      <motion.h2
        variants={fadeInUp}
        className="mx-auto mb-4 max-w-4xl text-4xl font-extrabold text-foreground md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

type SourceAtlasItem = (typeof siteContent.sourceAtlas)[number];
type ChapterExplorerItem =
  (typeof siteContent.chapterExplorer.chapters)[number];

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [selectedAtlasItem, setSelectedAtlasItem] =
    useState<SourceAtlasItem | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(
    siteContent.chapterExplorer.chapters[0]?.id ?? ""
  );
  const [activeStakeholderId, setActiveStakeholderId] = useState(
    siteContent.stakeholderViews.views[0]?.id ?? ""
  );
  const trackedSectionsRef = useRef(new Set<string>());

  const activeChapter: ChapterExplorerItem =
    siteContent.chapterExplorer.chapters.find(
      chapter => chapter.id === activeChapterId
    ) ?? siteContent.chapterExplorer.chapters[0];
  const activeChapterIndex = siteContent.chapterExplorer.chapters.findIndex(
    chapter => chapter.id === activeChapter.id
  );
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

    setSelectedAtlasItem(atlasItem);
  };

  const handleSearchSelection = (entry: (typeof searchEntries)[number]) => {
    if (entry.type === "section") {
      scrollToSection(entry.sectionId);
      return;
    }

    if (entry.type === "chapter") {
      setActiveChapterId(entry.chapterId);
      scrollToSection("explorer");
      return;
    }

    if (entry.type === "view") {
      setActiveStakeholderId(entry.viewId);
      scrollToSection("views");
      return;
    }

    openAtlasPage(entry.page);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
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
        setActiveNav("atlas");
        setSelectedAtlasItem(atlasItemsByPage.get(atlasPage) ?? null);
        window.requestAnimationFrame(() => {
          const el = document.getElementById("atlas");
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

  useEffect(() => {
    const activeView = siteContent.stakeholderViews.views.find(
      view => view.id === activeStakeholderId
    );
    if (!activeView) {
      return;
    }

    if (activeView.id === "product") {
      setActiveChapterId("systems-processes");
      return;
    }

    if (activeView.id === "leadership") {
      setActiveChapterId("recommendation-shortlist");
    }
  }, [activeStakeholderId]);

  const handlePdfOpen = (page?: number, surface?: string) => {
    trackReportEvent("report_pdf_open", {
      page: page ?? null,
      surface: surface ?? "unknown",
    });
  };

  const activeStakeholderView =
    siteContent.stakeholderViews.views.find(
      view => view.id === activeStakeholderId
    ) ?? siteContent.stakeholderViews.views[0];

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const heroParallax = prefersReducedMotion ? 0 : yParallax;
  const heroSnapshotMetrics = siteContent.keyMetrics.slice(0, 4);
  const executiveSourcePages = siteContent.executiveSummary.highlights.map(
    item => item.page
  );

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[100] origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Navigation */}
        <header>
          <nav
            aria-label="Section navigation"
            className="fixed top-1 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300"
          >
            <div className="container flex items-center justify-between h-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              >
                ULIX
              </motion.div>
              <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setQuickJumpOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  aria-label="Open quick jump"
                >
                  <Search className="h-3.5 w-3.5" />
                  Quick jump
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    ⌘K
                  </span>
                </button>
                {navigationItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={
                      activeNav === item.id ? "location" : undefined
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                      activeNav === item.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
              <button
                className="lg:hidden text-foreground p-2"
                onClick={() => setMobileMenuOpen(v => !v)}
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
                  className="lg:hidden bg-background/95 border-t border-border overflow-hidden"
                >
                  <div className="container py-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setQuickJumpOpen(true);
                      }}
                      className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
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
                        className={`px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors ${
                          activeNav === item.id
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
          {/* ─── HERO ─── */}
          <section
            id="overview"
            className="relative flex min-h-screen items-center overflow-hidden border-b border-border/50 bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 md:pt-44 md:pb-28"
          >
            <motion.div
              style={{ y: heroParallax }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-20 right-0 w-[40rem] h-[40rem] bg-primary rounded-full blur-[140px] opacity-10" />
              <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-accent rounded-full blur-[120px] opacity-10" />
            </motion.div>
            <div className="container relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid items-start gap-10 xl:grid-cols-[1.08fr_0.92fr]"
              >
                <div className="max-w-4xl">
                  <motion.div
                    variants={fadeInUp}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-bold text-primary shadow-sm"
                  >
                    {siteContent.hero.badge}
                  </motion.div>
                  <motion.p
                    variants={fadeInUp}
                    className="brief-kicker mb-4 text-accent"
                  >
                    Executive web edition
                  </motion.p>
                  <motion.h1
                    variants={fadeInUp}
                    className="mb-6 text-5xl font-extrabold leading-[0.98] tracking-tight md:text-7xl"
                  >
                    <span className="text-foreground">ULIX</span>{" "}
                    <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                      Discovery
                    </span>
                    <br />
                    <span className="text-foreground">Workshop Report</span>
                  </motion.h1>
                  <motion.p
                    variants={fadeInUp}
                    className="mb-4 max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl"
                  >
                    {siteContent.hero.subtitle}
                  </motion.p>
                  <motion.p
                    variants={fadeInUp}
                    className="mb-10 max-w-2xl text-lg leading-8 text-foreground/75"
                  >
                    {siteContent.hero.description}
                  </motion.p>
                  <motion.div
                    variants={fadeInUp}
                    className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 18px 48px rgba(15,118,110,0.26)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => scrollToSection("summary")}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
                    >
                      Read the 333-word brief
                      <ChevronDown className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection("guide")}
                      className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-primary/20 bg-background/70 px-8 py-4 text-lg font-bold text-primary hover:bg-primary/5"
                    >
                      Explore the report map
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={getPdfPageHref()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handlePdfOpen(undefined, "hero")}
                      className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-border bg-background/60 px-8 py-4 text-lg font-bold text-foreground hover:bg-secondary/40"
                    >
                      Open original PDF
                    </motion.a>
                  </motion.div>
                  <motion.div
                    variants={staggerContainer}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {siteContent.hero.highlights.map(item => (
                      <motion.div
                        key={item}
                        variants={fadeInUp}
                        className="section-shell rounded-3xl p-4"
                      >
                        <div className="mb-3 h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="text-sm leading-6 text-foreground/80">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  variants={fadeInUp}
                  className="section-shell rounded-[2rem] p-6 sm:p-8 xl:mt-8"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="brief-kicker mb-3 text-primary">
                        Briefing snapshot
                      </p>
                      <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">
                        What matters most
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickJumpOpen(true)}
                      className="hidden rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/30 hover:text-primary sm:inline-flex sm:items-center sm:gap-2"
                    >
                      <Search className="h-3.5 w-3.5" />
                      Quick jump
                    </button>
                  </div>
                  <p className="mb-6 text-lg leading-8 text-foreground/82">
                    {siteContent.executiveSummary.thesis}
                  </p>
                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    {heroSnapshotMetrics.map(metric => {
                      const Icon = iconMap[metric.icon] || Zap;
                      return (
                        <div
                          key={metric.label}
                          className="rounded-3xl border border-border/70 bg-background/70 p-4"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.bg}`}
                            >
                              <Icon className={`h-5 w-5 ${metric.color}`} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                {metric.label}
                              </p>
                              <p className="text-xl font-extrabold text-foreground">
                                {metric.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-primary/8 via-background to-accent/8 p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {siteContent.executiveSummary.takeawayStrip.map(item => (
                        <span
                          key={item}
                          className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-foreground/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => scrollToSection("atlas")}
                        className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-sm"
                      >
                        Compare summary vs source
                      </button>
                      <button
                        type="button"
                        onClick={() => openAtlasPage(executiveSourcePages[0])}
                        className="rounded-full border border-primary/20 px-4 py-2 font-semibold text-primary hover:bg-primary/5"
                      >
                        Open cited source pages
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ─── KEY METRICS STRIP ─── */}
          <section className="py-12 bg-foreground text-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
            <div className="container relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              >
                {siteContent.keyMetrics.map((metric, i) => {
                  const Icon = iconMap[metric.icon] || Zap;
                  return (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      whileHover={{ y: -6 }}
                      className="text-center"
                    >
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${metric.bg} mb-3 mx-auto`}
                      >
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <p className="text-2xl font-extrabold text-background mb-1">
                        {metric.value}
                      </p>
                      <p className="text-xs text-background/60 font-medium uppercase tracking-wide">
                        {metric.label}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          <section
            id="summary"
            className="relative bg-secondary/20 py-24 md:py-32"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="container">
              <SectionHeader
                accent="Fast Read"
                title={siteContent.executiveSummary.title}
                subtitle={siteContent.executiveSummary.subtitle}
              />
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {siteContent.executiveSummary.takeawayStrip.map(item => (
                  <span
                    key={item}
                    className="rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground/70 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="grid items-start gap-8 xl:grid-cols-[1.12fr_0.88fr]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  <motion.div variants={fadeInUp}>
                    <Card className="section-shell border-none rounded-[2rem] p-6 sm:p-8">
                      <div className="mb-6 flex flex-col gap-4 border-b border-border/70 pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="brief-kicker mb-3 text-primary">
                            Executive brief
                          </p>
                          <h3 className="text-3xl font-extrabold text-foreground md:text-4xl">
                            A briefing built for decisions
                          </h3>
                        </div>
                        <div className="rounded-3xl border border-primary/15 bg-primary/8 px-5 py-3 text-left md:text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Length
                          </p>
                          <p className="text-2xl font-extrabold text-primary">
                            {siteContent.executiveSummary.wordCount} words
                          </p>
                        </div>
                      </div>
                      <div className="mb-8 rounded-[1.75rem] bg-foreground px-6 py-6 text-background shadow-md">
                        <p className="brief-kicker mb-3 text-primary">
                          Core thesis
                        </p>
                        <p className="text-lg leading-8 text-background/85 md:text-xl">
                          {siteContent.executiveSummary.thesis}
                        </p>
                      </div>
                      <div className="executive-prose">
                        {siteContent.executiveSummary.briefing.map(paragraph => (
                          <p key={paragraph} className="mb-6">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {siteContent.executiveSummary.readingPaths.map(path => (
                      <Card
                        key={path.label}
                        className="section-shell border-none rounded-3xl p-5"
                      >
                        <p className="brief-kicker mb-3 text-primary">
                          Reading path
                        </p>
                        <p className="mb-2 text-lg font-bold text-foreground">
                          {path.label}
                        </p>
                        <p className="mb-4 text-sm leading-7 text-muted-foreground">
                          {path.description}
                        </p>
                        <button
                          onClick={() => scrollToSection(path.sectionId)}
                          className="text-sm font-semibold text-primary"
                        >
                          Jump to section
                        </button>
                      </Card>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4 xl:sticky xl:top-24"
                >
                  <motion.div variants={fadeInUp}>
                    <Card className="section-shell border-none rounded-[2rem] p-6">
                      <p className="brief-kicker mb-4 text-primary">
                        How to interpret the deck
                      </p>
                      <div className="space-y-4">
                        {siteContent.executiveSummary.actionLenses.map(item => (
                          <div
                            key={item.label}
                            className="rounded-3xl border border-border/70 bg-background/75 p-4"
                          >
                            <p className="mb-2 text-base font-bold text-foreground">
                              {item.label}
                            </p>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {siteContent.executiveSummary.highlights.map(item => (
                    <motion.div key={item.title} variants={fadeInUp}>
                      <Card className="section-shell border-none rounded-3xl p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-bold text-foreground">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => openAtlasPage(item.page)}
                            className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                          >
                            Page {item.page}
                          </button>
                        </div>
                        <p className="leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}

                  <motion.div variants={fadeInUp}>
                    <Card className="rounded-[2rem] border-none bg-foreground p-6 text-background shadow-lg">
                      <p className="brief-kicker mb-4 text-primary">
                        Evidence route
                      </p>
                      <p className="mb-5 text-base leading-8 text-background/78">
                        Use these cited pages when you need to validate the
                        summary against the original workshop material.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {executiveSourcePages.map(page => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => openAtlasPage(page)}
                            className="rounded-full bg-background/10 px-4 py-2 text-sm font-semibold text-background hover:bg-background/15"
                          >
                            Page {page}
                          </button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          <section
            id="views"
            className="relative bg-background py-24 md:py-32"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent" />
            <div className="container">
              <SectionHeader
                accent="Audience Paths"
                title={siteContent.stakeholderViews.title}
                subtitle={siteContent.stakeholderViews.description}
              />
              <div className="section-shell rounded-[2rem] p-4 sm:p-6">
                <StakeholderPaths
                  activeViewId={activeStakeholderView.id}
                  onSelectView={setActiveStakeholderId}
                  onJumpToSection={scrollToSection}
                  onOpenSourcePage={openAtlasPage}
                  onOpenPdf={handlePdfOpen}
                />
              </div>
            </div>
          </section>

          {/* ─── REPORT GUIDE ─── */}
          <section
            id="guide"
            className="relative bg-background py-24 md:py-32"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="container">
              <div className="mb-20">
                <SourceExperiencePanel
                  onJumpToSection={scrollToSection}
                  onOpenPdf={handlePdfOpen}
                />
              </div>
              <SectionHeader
                accent="Start Here"
                title={siteContent.reportGuide.title}
                subtitle={siteContent.reportGuide.description}
              />
              <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-5"
                >
                  {siteContent.reportGuide.layers.map((layer, i) => (
                    <motion.div key={layer.title} variants={fadeInUp}>
                      <Card className="section-shell border-none p-6 shadow-sm transition-all hover:shadow-lg md:p-7">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {layer.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {layer.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  <motion.div variants={fadeInUp}>
                    <Card className="section-shell border-none bg-primary/5 p-6 shadow-sm md:p-7">
                      <p className="brief-kicker mb-3 text-primary">
                        Reading Principle
                      </p>
                      <p className="text-foreground/85 leading-8">
                        The value here is not in compressing 155 slides into a
                        single paragraph. It is in giving readers a fast
                        narrative first, then a way to inspect the original
                        evidence when a diagram or screenshot matters.
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="relative"
                >
                  <Card className="section-shell overflow-hidden border-none p-6 shadow-sm md:p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                          <p className="brief-kicker mb-2 text-primary">
                            Report Map
                          </p>
                          <h3 className="text-2xl font-bold text-foreground">
                            What the deck covers
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-extrabold text-foreground">
                            155
                          </p>
                          <p className="text-sm text-muted-foreground">
                            slides in the original deck
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {siteContent.reportGuide.chapters.map(chapter => (
                          <div
                            key={chapter.range}
                            className="grid gap-4 rounded-[1.5rem] border border-border/70 bg-background/85 p-4 md:grid-cols-[120px_1fr]"
                          >
                            <div>
                              <p className="text-sm font-bold text-primary">
                                {chapter.range}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">
                                {chapter.label}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {chapter.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => scrollToSection("explorer")}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                        >
                          Open chapter explorer
                        </button>
                        <button
                          onClick={() => scrollToSection("atlas")}
                          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                        >
                          Jump to source atlas
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── CHAPTER EXPLORER ─── */}
          <section
            id="explorer"
            className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Explorer"
                title={siteContent.chapterExplorer.title}
                subtitle={siteContent.chapterExplorer.description}
              />
              <div className="grid xl:grid-cols-[0.78fr_1.22fr] gap-8 items-start">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid sm:grid-cols-2 xl:grid-cols-1 gap-4 xl:sticky xl:top-24"
                >
                  {siteContent.chapterExplorer.chapters.map((chapter, i) => {
                    const isActive = chapter.id === activeChapter.id;
                    return (
                      <motion.button
                        key={chapter.id}
                        variants={fadeInUp}
                        whileHover={{ y: -4 }}
                        onClick={() => setActiveChapterId(chapter.id)}
                        className="text-left"
                      >
                        <Card
                          className={`section-shell h-full p-5 transition-all ${
                            isActive
                              ? "border-primary/30 bg-background shadow-lg ring-1 ring-primary/15"
                              : "border-border/70 bg-background/80 shadow-sm hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
                                {chapter.range}
                              </p>
                              <h3 className="text-xl font-bold text-foreground">
                                {chapter.label}
                              </h3>
                            </div>
                            <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl bg-primary/10 px-3 text-sm font-bold text-primary">
                              {i + 1}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                            {chapter.summary}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs font-semibold text-foreground/70">
                            <span className="rounded-full bg-secondary px-3 py-1">
                              {chapter.takeaways.length} takeaways
                            </span>
                            <span className="rounded-full bg-secondary px-3 py-1">
                              {chapter.sourcePages.length} source page
                              {chapter.sourcePages.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </Card>
                      </motion.button>
                    );
                  })}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Card className="section-shell overflow-hidden border-none shadow-sm">
                      <div className="border-b border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                          <div className="max-w-3xl">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
                              Chapter {activeChapterIndex + 1} of{" "}
                              {siteContent.chapterExplorer.chapters.length} ·{" "}
                              {activeChapter.range}
                            </p>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                              {activeChapter.label}
                            </h3>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                              {activeChapter.summary}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:w-fit">
                            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 text-center">
                              <p className="text-2xl font-extrabold text-foreground">
                                {activeChapter.sourcePages.length}
                              </p>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                source pages
                              </p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 text-center">
                              <p className="text-2xl font-extrabold text-foreground">
                                {activeChapter.narrativeLinks.length}
                              </p>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                narrative links
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-8">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
                              Key Takeaways
                            </p>
                            <div className="space-y-3">
                              {activeChapter.takeaways.map(takeaway => (
                                <div
                                  key={takeaway}
                                  className="flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-background/75 p-4"
                                >
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                                  <p className="text-sm leading-relaxed text-foreground/85">
                                    {takeaway}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-8 rounded-[1.75rem] border border-primary/15 bg-primary/5 p-6">
                              <p className="brief-kicker mb-4 text-primary">
                                Continue In Narrative
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {activeChapter.narrativeLinks.map(link => (
                                  <button
                                    key={link.sectionId}
                                    onClick={() =>
                                      scrollToSection(link.sectionId)
                                    }
                                    className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                                  >
                                    {link.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
                                  Important Source Pages
                                </p>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  Open the rendered slide when the diagram,
                                  screenshot, or slide framing carries the
                                  detail.
                                </p>
                              </div>
                              <button
                                onClick={() => scrollToSection("atlas")}
                                className="text-sm font-semibold text-primary hover:text-accent"
                              >
                                View full atlas
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              {activeChapter.sourcePages.map(source => {
                                const atlasItem = atlasItemsByPage.get(
                                  source.page
                                );

                                if (!atlasItem) {
                                  return null;
                                }

                                return (
                                  <motion.button
                                    key={source.page}
                                    whileHover={{ y: -4 }}
                                    onClick={() => openAtlasPage(source.page)}
                                    className="text-left"
                                  >
                                    <Card className="section-shell h-full overflow-hidden border border-border/70 shadow-sm transition-all hover:shadow-lg">
                                      <div className="aspect-[16/10] overflow-hidden bg-secondary/30">
                                        <LazyImage
                                          src={atlasItem.image}
                                          alt={`${atlasItem.title} from page ${atlasItem.page}`}
                                          className="h-full w-full object-cover object-top"
                                        />
                                      </div>
                                      <div className="p-4">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                            Page {atlasItem.page}
                                          </span>
                                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                            {atlasItem.section}
                                          </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-foreground mb-2">
                                          {atlasItem.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                                          {source.focus}
                                        </p>
                                        <p className="text-sm font-semibold text-primary">
                                          Inspect original page
                                        </p>
                                      </div>
                                    </Card>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section
            id="roadmap"
            className="py-24 md:py-32 bg-background relative"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="container">
              <SectionHeader
                accent="Recommendations"
                title={siteContent.recommendationRoadmap.title}
                subtitle={siteContent.recommendationRoadmap.description}
              />
              <div className="section-shell mb-8 rounded-[2rem] p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {siteContent.recommendationRoadmap.phases.map(phase => (
                    <div
                      key={`${phase.name}-summary`}
                      className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4"
                    >
                      <p className="brief-kicker mb-2 text-primary">
                        {phase.name}
                      </p>
                      <p className="mb-1 text-lg font-bold text-foreground">
                        {phase.label}
                      </p>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {phase.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid xl:grid-cols-3 gap-6"
              >
                {siteContent.recommendationRoadmap.phases.map((phase, index) => (
                  <motion.div key={phase.name} variants={fadeInUp}>
                    <Card className="section-shell h-full border-none p-7 shadow-sm bg-secondary/30">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="brief-kicker mb-2 text-primary">
                            {phase.name}
                          </p>
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {phase.label}
                          </h3>
                          <p className="text-sm font-medium text-muted-foreground">
                            {phase.horizon}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-5">
                        {phase.summary}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {phase.items.map(item => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-accent shrink-0" />
                            <p className="text-sm leading-relaxed text-foreground/85">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {phase.sourcePages.map(page => (
                          <button
                            key={page}
                            onClick={() => openAtlasPage(page)}
                            className="rounded-full border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                          >
                            Open page {page}
                          </button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ─── VISION ─── */}
          <section
            id="vision"
            className="py-24 md:py-32 bg-secondary/30 relative"
          >
            <div className="container">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="section-shell rounded-[2rem] p-8 md:p-10"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="brief-kicker mb-4 text-primary"
                  >
                    Vision
                  </motion.p>
                  <motion.h2
                    variants={fadeInUp}
                    className="text-4xl md:text-5xl font-extrabold text-foreground mb-8"
                  >
                    {siteContent.vision.title}
                  </motion.h2>
                  <motion.blockquote
                    variants={fadeInUp}
                    className="text-2xl md:text-3xl font-semibold text-primary mb-8 italic border-l-4 border-accent pl-8 py-2"
                  >
                    "{siteContent.vision.statement}"
                  </motion.blockquote>
                  <motion.p
                    variants={fadeInUp}
                    className="mb-10 text-lg leading-8 text-muted-foreground"
                  >
                    {siteContent.vision.description}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="brief-kicker mb-6 text-muted-foreground"
                  >
                    Culture & Beliefs
                  </motion.p>
                  {siteContent.vision.cultureQuotes.map((q, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      whileHover={{ x: 6 }}
                    >
                      <Card className="section-shell rounded-[1.5rem] border-l-4 border-l-primary/40 p-6 shadow-sm transition-all hover:shadow-md">
                        <p className="text-foreground font-semibold italic mb-2">
                          "{q.quote}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {q.context}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── BUSINESS JOURNEY / TIMELINE ─── */}
          <section
            id="business"
            className="py-24 md:py-32 bg-background relative"
          >
            <div className="container">
              <SectionHeader
                accent="Company History"
                title={siteContent.businessReview.title}
                subtitle={siteContent.businessReview.subtitle}
              />
              <div className="space-y-28">
                {siteContent.businessReview.sections.map((section, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-80px" }}
                      variants={staggerContainer}
                      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
                    >
                      <motion.div
                        variants={fadeInUp}
                        className="section-shell space-y-5 rounded-[2rem] p-8"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wide">
                            {section.tag}
                          </span>
                          <span className="text-primary font-bold text-sm">
                            {section.year}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                          {section.heading}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        className="group relative"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                          <img
                            src={section.image}
                            alt={section.heading}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute bottom-5 left-5 z-20">
                            <span className="text-white font-bold text-lg drop-shadow-lg">
                              {section.year}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ─── BUSINESS MODEL CANVAS ─── */}
          <section
            id="business-model"
            className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Business Model Canvas"
                title={siteContent.businessModel.title}
                subtitle={siteContent.businessModel.subtitle}
              />
              <div className="section-shell-dark mb-8 rounded-[2rem] p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                  <div>
                    <p className="brief-kicker mb-3 text-primary">
                      Business model reading
                    </p>
                    <h3 className="mb-3 text-3xl font-extrabold text-background">
                      How ULIX turns distribution, community, and operations
                      into leverage
                    </h3>
                    <p className="max-w-3xl text-base leading-8 text-background/72">
                      The report argues that ULIX can turn transactional travel
                      work, partner relationships, and platform tooling into a
                      more defensible operating model.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-background/10 bg-background/5 p-4">
                      <p className="brief-kicker mb-2 text-primary">
                        Revenue mix
                      </p>
                      <p className="text-2xl font-extrabold text-background">
                        {siteContent.businessModel.revenueStreams.total}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-background/10 bg-background/5 p-4">
                      <p className="brief-kicker mb-2 text-primary">
                        Focus
                      </p>
                      <p className="text-base leading-7 text-background/80">
                        Combine partner value, operating scale, and clear
                        customer propositions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Streams Visual */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mb-16"
              >
                <motion.h3
                  variants={fadeInUp}
                  className="text-2xl font-bold text-primary mb-6 text-center"
                >
                  {siteContent.businessModel.revenueStreams.label}
                </motion.h3>
                <motion.p
                  variants={fadeInUp}
                  className="text-center text-background/60 mb-8 font-medium"
                >
                  {siteContent.businessModel.revenueStreams.total}
                </motion.p>
                <motion.div
                  variants={staggerContainer}
                  className="grid md:grid-cols-5 gap-4"
                >
                  {siteContent.businessModel.revenueStreams.items.map(
                    (stream, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ y: -6 }}
                        className={`section-shell-dark rounded-[1.75rem] p-6 text-center transition-colors hover:bg-background/10 ${
                          i === 0
                            ? "border-primary/30"
                            : i === 1
                              ? "border-accent/25"
                              : "border-background/10"
                        }`}
                      >
                        <div
                          className="text-3xl font-black mb-2"
                          style={{ color: stream.color }}
                        >
                          {stream.percent ? `${stream.percent}%` : stream.value}
                        </div>
                        <p className="text-background font-semibold text-sm mb-2">
                          {stream.label}
                        </p>
                        <p className="text-background/50 text-xs leading-relaxed">
                          {stream.description}
                        </p>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </motion.div>

              {/* Canvas Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  siteContent.businessModel.keyPartners,
                  siteContent.businessModel.keyActivities,
                  siteContent.businessModel.keyResources,
                ].map((block, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="section-shell-dark rounded-[1.75rem] p-8"
                  >
                    <p className="brief-kicker mb-3 text-primary">
                      Core block {i + 1}
                    </p>
                    <h3 className="text-primary font-bold text-lg mb-5 uppercase tracking-wider">
                      {block.label}
                    </h3>
                    <ul className="space-y-3">
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex gap-3 items-start text-sm text-background/80"
                        >
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {typeof item === "string"
                            ? item
                            : item.label + ": " + item.detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Value Propositions */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-8"
              >
                <motion.h3
                  variants={fadeInUp}
                  className="text-xl font-bold text-primary mb-6 uppercase tracking-wider"
                >
                  {siteContent.businessModel.valuePropositions.label}
                </motion.h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {siteContent.businessModel.valuePropositions.items.map(
                    (vp, i) => {
                      const Icon = iconMap[vp.icon] || Star;
                      return (
                        <motion.div
                          key={i}
                          variants={fadeInUp}
                          whileHover={{ y: -5 }}
                          className={`section-shell-dark rounded-[1.5rem] p-6 transition-colors hover:bg-background/10 ${
                            i % 2 === 0 ? "border-primary/20" : "border-accent/20"
                          }`}
                        >
                          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">
                            {vp.segment}
                          </p>
                          <p className="text-background/75 text-sm leading-relaxed">
                            {vp.value}
                          </p>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </motion.div>

              {/* Customer Segments */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-8"
              >
                <motion.h3
                  variants={fadeInUp}
                  className="text-xl font-bold text-primary mb-6 uppercase tracking-wider"
                >
                  {siteContent.businessModel.customerSegments.label}
                </motion.h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {siteContent.businessModel.customerSegments.items.map(
                    (cs, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="section-shell-dark rounded-[1.35rem] p-5"
                      >
                        <p className="brief-kicker mb-2 text-primary">
                          Segment
                        </p>
                        <p className="text-background font-bold mb-2">
                          {cs.segment}
                        </p>
                        <p className="text-background/60 text-sm">
                          {cs.detail}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ─── PRODUCTS & SERVICES ─── */}
          <section
            id="products"
            className="py-24 md:py-32 bg-primary/5 relative"
          >
            <div className="container">
              <SectionHeader
                accent="Products & Services"
                title={siteContent.productStrategy.title}
                subtitle={siteContent.productStrategy.subtitle}
              />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-8"
              >
                {siteContent.productStrategy.sections.map((section, i) => {
                  const Icon = iconMap[section.icon] || Zap;
                  return (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      whileHover={{ y: -6 }}
                    >
                      <Card className="section-shell p-10 h-full border-none bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400" />
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          {section.heading}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {section.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {section.tags.map((tag, j) => (
                            <span
                              key={j}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ─── TECHNOLOGY SYSTEMS ─── */}
          <section
            id="systems"
            className="py-24 md:py-32 bg-background relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Technology Architecture"
                title={siteContent.systemsOverview.title}
                subtitle={siteContent.systemsOverview.subtitle}
              />
              <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-muted-foreground leading-relaxed mb-8 text-lg"
                  >
                    {siteContent.systemsOverview.description}
                  </motion.p>
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-xl font-bold text-foreground mb-5">
                      Content Sources
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {siteContent.systemsOverview.contentSources.map(
                        (src, i) => (
                          <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="section-shell flex items-start gap-3 rounded-xl border border-border/50 p-4"
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                              style={{ backgroundColor: src.color }}
                            />
                            <div>
                              <p className="font-bold text-foreground text-sm">
                                {src.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {src.category} · {src.description}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.div
                    variants={fadeInUp}
                    className="relative mb-8 aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl"
                  >
                    <img
                      src={siteContent.systemsOverview.image}
                      alt="Tech Architecture"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                      <p className="text-white font-bold text-lg">
                        Integrated Technology Platform
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* TMC Modules + B2C Brands */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-xl font-bold text-foreground mb-5"
                  >
                    TMC System Modules
                  </motion.h3>
                  <div className="grid grid-cols-3 gap-3">
                    {siteContent.systemsOverview.tmcModules.map((mod, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="section-shell rounded-xl border border-primary/10 p-3 text-center"
                      >
                        <p className="text-xs font-semibold text-primary">
                          {mod}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-xl font-bold text-foreground mb-5"
                  >
                    B2C Brand Portfolio
                  </motion.h3>
                  <div className="grid grid-cols-2 gap-4">
                    {siteContent.systemsOverview.b2cBrands.map((brand, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="section-shell border-none bg-secondary/30 p-6 shadow-sm transition-all hover:shadow-md">
                          <div className="text-3xl mb-2">{brand.flag}</div>
                          <p className="font-bold text-foreground text-sm">
                            {brand.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {brand.country}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── TRAVEL HUB ─── */}
          <section
            id="hub"
            className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden"
          >
            <div className="container relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="section-shell rounded-[2rem] p-8 md:p-10"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="brief-kicker mb-4 text-primary"
                  >
                    Community Platform
                  </motion.p>
                  <motion.h2
                    variants={fadeInUp}
                    className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
                  >
                    {siteContent.travelHub.title}
                  </motion.h2>
                  <motion.p
                    variants={fadeInUp}
                    className="text-xl text-primary font-bold mb-6"
                  >
                    {siteContent.travelHub.description}
                  </motion.p>
                  <motion.p
                    variants={fadeInUp}
                    className="text-lg text-muted-foreground leading-relaxed mb-8"
                  >
                    {siteContent.travelHub.content}
                  </motion.p>
                  <motion.div
                    variants={staggerContainer}
                    className="space-y-3 mb-10"
                  >
                    {siteContent.travelHub.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="flex gap-3 items-start"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                          {i + 1}
                        </div>
                        <p className="text-foreground/80 leading-relaxed">
                          {feature}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div
                    variants={fadeInUp}
                    className="rounded-[1.75rem] border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-6"
                  >
                    <p className="brief-kicker mb-2 text-primary">
                      Future Vision
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {siteContent.travelHub.futureVision}
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
                    <img
                      src={siteContent.travelHub.image}
                      alt="Travel Hub"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── AMADEUS PARTNERSHIP ─── */}
          <section
            id="amadeus"
            className="py-24 md:py-32 bg-background relative"
          >
            <div className="container">
              <SectionHeader
                accent="Workshop Partner"
                title={siteContent.amadeus.title}
                subtitle={siteContent.amadeus.subtitle}
              />
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mb-16"
              >
                {siteContent.amadeus.description}
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
              >
                {siteContent.amadeus.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="section-shell p-6 text-center border-none shadow-sm hover:shadow-xl bg-primary/3 hover:bg-primary/5 transition-all">
                      <p className="text-2xl font-extrabold text-primary mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Vision + Specializations */}
              <div className="grid md:grid-cols-2 gap-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card className="section-shell p-10 border-none shadow-md bg-gradient-to-br from-primary/5 to-accent/5 h-full">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {siteContent.amadeus.vision}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {siteContent.amadeus.visionDescription}
                    </p>
                  </Card>
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <Card className="section-shell p-10 border-none shadow-md h-full">
                    <h3 className="text-xl font-bold text-foreground mb-5">
                      Customer Specializations
                    </h3>
                    <div className="space-y-3">
                      {siteContent.amadeus.specializations.map((spec, i) => (
                        <motion.div
                          key={i}
                          variants={fadeInUp}
                          className="flex gap-3 items-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <p className="text-foreground/80">{spec}</p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Amadeus Conversion Pillars */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-16"
              >
                <motion.h3
                  variants={fadeInUp}
                  className="text-2xl font-bold text-foreground text-center mb-10"
                >
                  {siteContent.amadeusPillars.title}
                </motion.h3>
                <motion.p
                  variants={fadeInUp}
                  className="text-muted-foreground text-center mb-10"
                >
                  {siteContent.amadeusPillars.subtitle}
                </motion.p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {siteContent.amadeusPillars.pillars.map((pillar, i) => {
                    const Icon = iconMap[pillar.icon] || Zap;
                    return (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ y: -8 }}
                      >
                        <Card className="section-shell p-8 h-full border-none shadow-sm hover:shadow-xl transition-all group bg-background">
                          <div
                            className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className={`w-7 h-7 ${pillar.color}`} />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-3">
                            {pillar.name}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                            {pillar.description}
                          </p>
                          <ul className="space-y-2">
                            {pillar.actions.map((action, j) => (
                              <li
                                key={j}
                                className="flex gap-2 items-start text-xs text-muted-foreground"
                              >
                                <span className="text-primary mt-0.5">→</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ─── CHALLENGES & OPPORTUNITIES ─── */}
          <section
            id="challenges"
            className="relative bg-secondary/20 py-24 md:py-32"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/6 via-transparent to-transparent" />
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Challenges */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-sm font-bold uppercase tracking-widest text-accent mb-4"
                  >
                    Current Constraints
                  </motion.p>
                  <motion.h2
                    variants={fadeInUp}
                    className="text-4xl font-extrabold text-foreground mb-10"
                  >
                    {siteContent.challenges.title}
                  </motion.h2>
                  <div className="space-y-5">
                    {siteContent.challenges.items.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ x: 8 }}
                      >
                        <Card className="section-shell p-7 border-l-4 border-l-accent border-y-0 border-r-0 rounded-r-[1.5rem] hover:shadow-lg transition-all bg-background/80">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-foreground">
                              {item.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                item.severity === "high"
                                  ? "bg-red-100 text-red-600"
                                  : item.severity === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {item.severity}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {item.description}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Opportunities */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-sm font-bold uppercase tracking-widest text-primary mb-4"
                  >
                    Growth Levers
                  </motion.p>
                  <motion.h2
                    variants={fadeInUp}
                    className="text-4xl font-extrabold text-foreground mb-10"
                  >
                    {siteContent.opportunities.title}
                  </motion.h2>
                  <div className="space-y-5">
                    {siteContent.opportunities.items.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ x: -8 }}
                      >
                        <Card className="section-shell p-7 border-r-4 border-r-primary border-y-0 border-l-0 rounded-l-[1.5rem] hover:shadow-lg transition-all bg-primary/5 hover:bg-primary/8">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-primary">
                              {item.title}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-foreground/70 leading-relaxed text-sm">
                            {item.description}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── STRATEGY ─── */}
          <section
            id="strategy"
            className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent pointer-events-none" />
            <div className="container relative z-10">
              <SectionHeader
                accent="Priority Moves"
                title={siteContent.strategy.title}
              />
              <div className="grid md:grid-cols-2 gap-10">
                {/* Short term */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="section-shell-dark rounded-[2rem] p-10"
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-2xl font-bold text-primary mb-8 flex items-center gap-3"
                  >
                    <div className="p-2 bg-primary/20 rounded-xl">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    {siteContent.strategy.shortTerm.heading}
                  </motion.h3>
                  <ul className="space-y-5">
                    {siteContent.strategy.shortTerm.initiatives.map(
                      (init, i) => (
                        <motion.li
                          key={i}
                          variants={fadeInUp}
                          className="flex gap-4"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-background flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-background/85 leading-relaxed">
                            {init}
                          </p>
                        </motion.li>
                      )
                    )}
                  </ul>
                </motion.div>

                {/* Long term */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="section-shell-dark rounded-[2rem] p-10"
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-2xl font-bold text-accent mb-8 flex items-center gap-3"
                  >
                    <div className="p-2 bg-accent/20 rounded-xl">
                      <Rocket className="w-6 h-6 text-accent" />
                    </div>
                    {siteContent.strategy.longTerm.heading}
                  </motion.h3>
                  <ul className="space-y-5">
                    {siteContent.strategy.longTerm.initiatives.map(
                      (init, i) => (
                        <motion.li
                          key={i}
                          variants={fadeInUp}
                          className="flex gap-4"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-background/85 leading-relaxed">
                            {init}
                          </p>
                        </motion.li>
                      )
                    )}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── OPERATIONS ─── */}
          <section className="py-20 bg-primary/5 relative">
            <div className="container">
              <SectionHeader
                accent="Operating Model"
                title={siteContent.processesOverview.title}
                subtitle={siteContent.processesOverview.description}
              />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {siteContent.processesOverview.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="section-shell p-7 border-none shadow-sm hover:shadow-lg transition-all h-full">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">
                        {h.item}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {h.detail}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ─── SOURCE ATLAS ─── */}
          <section id="atlas" className="py-24 md:py-32 bg-background relative">
            <div className="container">
              <SectionHeader
                accent="Source Atlas"
                title="High-Value Source Pages"
                subtitle="These pages preserve the diagrams, screenshots, and slide framing that carry the most meaning in the original report."
              />
              <div className="section-shell mb-8 flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-secondary/20 p-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold text-foreground">
                    Use the rendered atlas for fast inspection, or jump straight
                    into the original PDF when the surrounding slide context
                    matters.
                  </p>
                </div>
                <a
                  href={getPdfPageHref()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handlePdfOpen(undefined, "atlas")}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Open full PDF
                </a>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid lg:grid-cols-2 gap-6"
              >
                {siteContent.sourceAtlas.map(item => (
                  <motion.div
                    key={item.page}
                    variants={fadeInUp}
                    whileHover={{ y: -6 }}
                  >
                    <Card className="section-shell overflow-hidden border-none shadow-sm hover:shadow-xl transition-all h-full">
                      <button
                        type="button"
                        onClick={() => openAtlasPage(item.page)}
                        className="w-full text-left"
                      >
                        <div className="aspect-[16/9] overflow-hidden bg-secondary/30">
                          <LazyImage
                            src={item.image}
                            alt={`${item.title} from page ${item.page}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                              Page {item.page}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {item.section}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {item.summary}
                          </p>
                          <p className="text-sm font-medium text-foreground/80">
                            Why it matters: {item.whyItMatters}
                          </p>
                        </div>
                      </button>
                      <div className="px-6 pb-6">
                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground/75">
                            Web summary + source
                          </span>
                          <a
                            href={getPdfPageHref(item.page)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={event => {
                              event.stopPropagation();
                              handlePdfOpen(item.page, "atlas-card");
                            }}
                            className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/5"
                          >
                            PDF page jump
                          </a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-border bg-background py-16 text-foreground">
          <div className="container">
            <div className="section-shell mb-10 rounded-[2rem] p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <p className="brief-kicker mb-3 text-primary">
                    Confidential workshop edition
                  </p>
                  <h3 className="mb-3 text-3xl font-extrabold text-foreground">
                    Built for quick executive reading and source-backed review
                  </h3>
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                    This web version is meant to shorten the time from reading
                    to decision-making while preserving access to the original
                    evidence in the Amadeus workshop deck.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-primary/15 bg-primary/8 p-4">
                    <p className="brief-kicker mb-2 text-primary">
                      Document status
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      Confidential and restricted
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4">
                    <p className="brief-kicker mb-2 text-primary">
                      Source access
                    </p>
                    <a
                      href={getPdfPageHref()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handlePdfOpen(undefined, "footer")}
                      className="text-sm font-semibold text-primary hover:text-accent"
                    >
                      Open the original PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-12 md:grid-cols-4 mb-12">
              <div>
                <h3 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-transparent">
                  ULIX
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Empowering independent travel agencies through technology and
                  community. Discovery Workshop Report, October 2018.
                </p>
                <p className="mt-4 text-xs italic text-muted-foreground">
                  Confidential & Restricted
                </p>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">Brands</h4>
                <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
                  <li>🇭🇷 AVIOKARTE.HR — Croatia</li>
                  <li>🇸🇮 LETALSKE.SI — Slovenia</li>
                  <li>🇷🇸 AVIOKARTE.ORG — Serbia</li>
                  <li>🇵🇱 LOTEKSPERT.PL — Poland</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">Key Numbers</h4>
                <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
                  <li>30M EUR Annual Turnover</li>
                  <li>117 Total Employees</li>
                  <li>4 Countries</li>
                  <li>30+ Partner Agencies</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">Report Info</h4>
                <p className="text-sm leading-7 text-muted-foreground">
                  ULIX Discovery Workshop Report
                  <br />
                  Prepared by Amadeus
                  <br />
                  October 2018
                  <br />
                  Internal Strategic Roadmap
                </p>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  Handle this material as restricted workshop content. Share
                  direct links and screenshots only with approved stakeholders.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
              <p>© {new Date().getFullYear()} ULIX. All rights reserved.</p>
              <p className="mt-4 md:mt-0">Executive briefing web edition.</p>
            </div>
          </div>
        </footer>

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
      </div>
    </>
  );
}
