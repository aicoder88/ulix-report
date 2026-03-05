import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ChevronDown, Zap, Users, Rocket, TrendingUp, Globe, Code, Award,
  Database, Target, Smartphone, BookOpen, Headphones, MousePointer,
  Star, Briefcase, Network, CheckCircle,
} from "lucide-react";
import { siteContent, navigationItems } from "@/lib/content";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Users, Globe, Zap, Network, Award, Code, Database,
  Target, Smartphone, Star, Briefcase, Rocket, BookOpen, Headphones,
  MousePointer, CheckCircle,
};

function SectionHeader({ accent, title, subtitle }: { accent: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="mb-16 text-center"
    >
      <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
        {accent}
      </motion.p>
      <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navigationItems.map((i) => i.id);
      const scrollPos = window.scrollY + 120;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveNav(id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMobileMenuOpen(false);
  };

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 250]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="fixed top-1 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
        <div className="container flex items-center justify-between h-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          >
            ULIX
          </motion.div>
          <div className="hidden lg:flex gap-0.5 overflow-x-auto">
            {navigationItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${activeNav === item.id
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
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background/95 border-t border-border overflow-hidden"
            >
              <div className="container py-4 grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors ${activeNav === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
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

      {/* ─── HERO ─── */}
      <section
        id="overview"
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[40rem] h-[40rem] bg-primary rounded-full blur-[140px] opacity-10" />
          <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-accent rounded-full blur-[120px] opacity-10" />
        </motion.div>
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20">
              {siteContent.hero.badge}
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              <span className="text-foreground">ULIX</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Discovery</span>
              <br />
              <span className="text-foreground">Workshop Report</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              {siteContent.hero.subtitle}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-foreground/70 mb-12 leading-relaxed max-w-2xl mx-auto">
              {siteContent.hero.description}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(15,118,110,0.35)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("vision")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-xl"
              >
                Explore the Journey <ChevronDown className="w-5 h-5 animate-bounce" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection("strategy")}
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-primary/30 text-primary rounded-full font-bold text-lg hover:bg-primary/5 transition-colors"
              >
                View Strategy
              </motion.button>
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
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${metric.bg} mb-3 mx-auto`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-extrabold text-background mb-1">{metric.value}</p>
                  <p className="text-xs text-background/60 font-medium uppercase tracking-wide">{metric.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── VISION ─── */}
      <section id="vision" className="py-24 md:py-32 bg-secondary/30 relative">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                The Mission
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-8">
                {siteContent.vision.title}
              </motion.h2>
              <motion.blockquote variants={fadeInUp} className="text-2xl md:text-3xl font-semibold text-primary mb-8 italic border-l-4 border-accent pl-8 py-2">
                "{siteContent.vision.statement}"
              </motion.blockquote>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed mb-10">
                {siteContent.vision.description}
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-4">
              <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                Culture & Beliefs
              </motion.p>
              {siteContent.vision.cultureQuotes.map((q, i) => (
                <motion.div key={i} variants={fadeInUp} whileHover={{ x: 6 }}>
                  <Card className="p-6 border-l-4 border-l-primary/40 rounded-xl bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                    <p className="text-foreground font-semibold italic mb-2">"{q.quote}"</p>
                    <p className="text-xs text-muted-foreground">{q.context}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BUSINESS JOURNEY / TIMELINE ─── */}
      <section id="business" className="py-24 md:py-32 bg-background relative">
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
                  <motion.div variants={fadeInUp} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wide">
                        {section.tag}
                      </span>
                      <span className="text-primary font-bold text-sm">{section.year}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                      {section.heading}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{section.content}</p>
                  </motion.div>

                  <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="group relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                      <img
                        src={section.image}
                        alt={section.heading}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute bottom-5 left-5 z-20">
                        <span className="text-white font-bold text-lg drop-shadow-lg">{section.year}</span>
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
      <section id="business-model" className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <SectionHeader
            accent="Business Model Canvas"
            title={siteContent.businessModel.title}
            subtitle={siteContent.businessModel.subtitle}
          />

          {/* Revenue Streams Visual */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-primary mb-6 text-center">
              {siteContent.businessModel.revenueStreams.label}
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-center text-background/60 mb-8 font-medium">
              {siteContent.businessModel.revenueStreams.total}
            </motion.p>
            <motion.div variants={staggerContainer} className="grid md:grid-cols-5 gap-4">
              {siteContent.businessModel.revenueStreams.items.map((stream, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className="bg-background/5 border border-background/10 rounded-2xl p-6 text-center hover:bg-background/10 transition-colors"
                >
                  <div className="text-3xl font-black mb-2" style={{ color: stream.color }}>
                    {stream.percent ? `${stream.percent}%` : stream.value}
                  </div>
                  <p className="text-background font-semibold text-sm mb-2">{stream.label}</p>
                  <p className="text-background/50 text-xs leading-relaxed">{stream.description}</p>
                </motion.div>
              ))}
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
                className="bg-background/5 border border-background/10 rounded-2xl p-8"
              >
                <h3 className="text-primary font-bold text-lg mb-5 uppercase tracking-wider">{block.label}</h3>
                <ul className="space-y-3">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3 items-start text-sm text-background/80">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {typeof item === "string" ? item : item.label + ": " + item.detail}
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
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-primary mb-6 uppercase tracking-wider">
              {siteContent.businessModel.valuePropositions.label}
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {siteContent.businessModel.valuePropositions.items.map((vp, i) => {
                const Icon = iconMap[vp.icon] || Star;
                return (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-background/5 border border-background/10 rounded-2xl p-6 hover:bg-background/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{vp.segment}</p>
                    <p className="text-background/75 text-sm leading-relaxed">{vp.value}</p>
                  </motion.div>
                );
              })}
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
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-primary mb-6 uppercase tracking-wider">
              {siteContent.businessModel.customerSegments.label}
            </motion.h3>
            <div className="grid md:grid-cols-4 gap-4">
              {siteContent.businessModel.customerSegments.items.map((cs, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-background/5 border border-background/10 rounded-xl p-5"
                >
                  <p className="text-background font-bold mb-2">{cs.segment}</p>
                  <p className="text-background/60 text-sm">{cs.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCTS & SERVICES ─── */}
      <section id="products" className="py-24 md:py-32 bg-primary/5 relative">
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
                <motion.div key={i} variants={fadeInUp} whileHover={{ y: -6 }}>
                  <Card className="p-10 h-full border-none bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400" />
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{section.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{section.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {section.tags.map((tag, j) => (
                        <span key={j} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
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
      <section id="systems" className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10">
          <SectionHeader
            accent="Technology Architecture"
            title={siteContent.systemsOverview.title}
            subtitle={siteContent.systemsOverview.subtitle}
          />
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-8 text-lg">
                {siteContent.systemsOverview.description}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-bold text-foreground mb-5">Content Sources</h3>
                <div className="grid grid-cols-2 gap-3">
                  {siteContent.systemsOverview.contentSources.map((src, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: src.color }} />
                      <div>
                        <p className="font-bold text-foreground text-sm">{src.name}</p>
                        <p className="text-xs text-muted-foreground">{src.category} · {src.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 aspect-[4/3]">
                <img src={siteContent.systemsOverview.image} alt="Tech Architecture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-lg">Integrated Technology Platform</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* TMC Modules + B2C Brands */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h3 variants={fadeInUp} className="text-xl font-bold text-foreground mb-5">TMC System Modules</motion.h3>
              <div className="grid grid-cols-3 gap-3">
                {siteContent.systemsOverview.tmcModules.map((mod, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center"
                  >
                    <p className="text-xs font-semibold text-primary">{mod}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h3 variants={fadeInUp} className="text-xl font-bold text-foreground mb-5">B2C Brand Portfolio</motion.h3>
              <div className="grid grid-cols-2 gap-4">
                {siteContent.systemsOverview.b2cBrands.map((brand, i) => (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                    <Card className="p-6 border-none bg-secondary/30 shadow-sm hover:shadow-md transition-all">
                      <div className="text-3xl mb-2">{brand.flag}</div>
                      <p className="font-bold text-foreground text-sm">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">{brand.country}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL HUB ─── */}
      <section id="hub" className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                Community & Innovation
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                {siteContent.travelHub.title}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-primary font-bold mb-6">
                {siteContent.travelHub.description}
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
                {siteContent.travelHub.content}
              </motion.p>
              <motion.div variants={staggerContainer} className="space-y-3 mb-10">
                {siteContent.travelHub.features.map((feature, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{feature}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Future Vision</p>
                <p className="text-foreground/80 leading-relaxed">{siteContent.travelHub.futureVision}</p>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} whileHover={{ scale: 1.01 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                <img src={siteContent.travelHub.image} alt="Travel Hub" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── AMADEUS PARTNERSHIP ─── */}
      <section id="amadeus" className="py-24 md:py-32 bg-background relative">
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
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5 }}>
                <Card className="p-6 text-center border-none shadow-sm hover:shadow-xl bg-primary/3 hover:bg-primary/5 transition-all">
                  <p className="text-2xl font-extrabold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Vision + Specializations */}
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <Card className="p-10 border-none shadow-md bg-gradient-to-br from-primary/5 to-accent/5 h-full">
                <h3 className="text-2xl font-bold text-foreground mb-3">{siteContent.amadeus.vision}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{siteContent.amadeus.visionDescription}</p>
              </Card>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <Card className="p-10 border-none shadow-md h-full">
                <h3 className="text-xl font-bold text-foreground mb-5">Customer Specializations</h3>
                <div className="space-y-3">
                  {siteContent.amadeus.specializations.map((spec, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex gap-3 items-center">
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
            <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-foreground text-center mb-10">
              {siteContent.amadeusPillars.title}
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-10">
              {siteContent.amadeusPillars.subtitle}
            </motion.p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteContent.amadeusPillars.pillars.map((pillar, i) => {
                const Icon = iconMap[pillar.icon] || Zap;
                return (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }}>
                    <Card className="p-8 h-full border-none shadow-sm hover:shadow-xl transition-all group bg-background">
                      <div className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${pillar.color}`} />
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-3">{pillar.name}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5">{pillar.description}</p>
                      <ul className="space-y-2">
                        {pillar.actions.map((action, j) => (
                          <li key={j} className="flex gap-2 items-start text-xs text-muted-foreground">
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
      <section id="challenges" className="py-24 md:py-32 bg-secondary/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Challenges */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
                Honest Assessment
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold text-foreground mb-10">
                {siteContent.challenges.title}
              </motion.h2>
              <div className="space-y-5">
                {siteContent.challenges.items.map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ x: 8 }}>
                    <Card className="p-7 border-l-4 border-l-accent border-y-0 border-r-0 rounded-r-xl hover:shadow-lg transition-all bg-background/80">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : item.severity === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                          }`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Opportunities */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                Growth Potential
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold text-foreground mb-10">
                {siteContent.opportunities.title}
              </motion.h2>
              <div className="space-y-5">
                {siteContent.opportunities.items.map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ x: -8 }}>
                    <Card className="p-7 border-r-4 border-r-primary border-y-0 border-l-0 rounded-l-xl hover:shadow-lg transition-all bg-primary/5 hover:bg-primary/8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-foreground/70 leading-relaxed text-sm">{item.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STRATEGY ─── */}
      <section id="strategy" className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <SectionHeader accent="What Comes Next" title={siteContent.strategy.title} />
          <div className="grid md:grid-cols-2 gap-10">
            {/* Short term */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="bg-background/5 border border-background/10 rounded-3xl p-10"
            >
              <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl"><Zap className="w-6 h-6 text-primary" /></div>
                {siteContent.strategy.shortTerm.heading}
              </motion.h3>
              <ul className="space-y-5">
                {siteContent.strategy.shortTerm.initiatives.map((init, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-background flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-background/85 leading-relaxed">{init}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Long term */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="bg-background/5 border border-background/10 rounded-3xl p-10"
            >
              <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-accent mb-8 flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-xl"><Rocket className="w-6 h-6 text-accent" /></div>
                {siteContent.strategy.longTerm.heading}
              </motion.h3>
              <ul className="space-y-5">
                {siteContent.strategy.longTerm.initiatives.map((init, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-background/85 leading-relaxed">{init}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── OPERATIONS ─── */}
      <section className="py-20 bg-primary/5 relative">
        <div className="container">
          <SectionHeader
            accent="How We Work"
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
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5 }}>
                <Card className="p-7 border-none shadow-sm hover:shadow-lg transition-all h-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{h.item}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{h.detail}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-background text-foreground py-16 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ULIX
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering independent travel agencies through technology and community. Discovery Workshop Report, October 2018.
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">Confidential & Restricted</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Brands</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🇭🇷 AVIOKARTE.HR — Croatia</li>
                <li>🇸🇮 LETALSKE.SI — Slovenia</li>
                <li>🇷🇸 AVIOKARTE.ORG — Serbia</li>
                <li>🇵🇱 LOTEKSPERT.PL — Poland</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Key Numbers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>30M EUR Annual Turnover</li>
                <li>117 Total Employees</li>
                <li>4 Countries</li>
                <li>30+ Partner Agencies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Report Info</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ULIX Discovery Workshop Report<br />
                Prepared by Amadeus<br />
                October 2018<br />
                Internal Strategic Roadmap
              </p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ULIX. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Transforming Travel Through Technology 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
