import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Zap, Users, Rocket, TrendingUp, Globe, Code, Award } from "lucide-react";
import { siteContent, navigationItems } from "@/lib/content";

/**
 * ULIX Discovery Workshop Report Website
 * Design: Modern Minimalist with Depth
 * - Color: Teal primary, cream secondary, coral accents
 * - Typography: Poppins bold headings, Inter readable body
 * - Layout: Asymmetric with generous whitespace
 * - Animations: Smooth scroll-triggered fade-ins
 */

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveNav(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm-depth">
        <div className="container flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary">ULIX</div>
          <div className="hidden md:flex gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeNav === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
              {siteContent.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
              {siteContent.hero.subtitle}
            </p>
            <p className="text-lg text-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              {siteContent.hero.description}
            </p>
            <button
              onClick={() => scrollToSection("vision")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md-depth hover:shadow-lg-depth"
            >
              Explore the Report <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 md:py-32 bg-secondary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-stagger-item">
              <div className="gradient-divider mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                {siteContent.vision.title}
              </h2>
              <blockquote className="text-2xl font-semibold text-primary mb-6 italic border-l-4 border-accent pl-6">
                "{siteContent.vision.statement}"
              </blockquote>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                {siteContent.vision.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-stagger-item">
              {[
                { icon: Users, label: "Community", value: "70+ Team Members" },
                { icon: Globe, label: "Global Reach", value: "4 Countries" },
                { icon: TrendingUp, label: "Growth", value: "30M EUR Turnover" },
                { icon: Zap, label: "Innovation", value: "Custom Technology" },
              ].map((item, i) => (
                <Card key={i} className="p-6 text-center hover:shadow-md-depth transition-all duration-200">
                  <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <p className="font-semibold text-primary mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Review Section */}
      <section id="business" className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="mb-16">
            <div className="gradient-divider mb-6 w-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {siteContent.businessReview.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              From a single travel agency to a regional technology leader, ULIX's journey demonstrates the power of innovation, resilience, and community focus.
            </p>
          </div>

          <div className="space-y-12">
            {siteContent.businessReview.sections.map((section, i) => (
              <div key={i} className={`grid md:grid-cols-2 gap-8 items-start animate-stagger-item ${i % 2 === 1 ? "md:grid-cols-2 md:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{section.heading}</h3>
                  <p className="text-lg text-foreground leading-relaxed">{section.content}</p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-primary">Innovation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products & Services Section */}
      <section id="products" className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container">
          <div className="mb-16">
            <div className="gradient-divider mb-6 w-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {siteContent.productStrategy.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {siteContent.productStrategy.sections.map((section, i) => (
              <Card key={i} className="p-8 hover:shadow-md-depth transition-all duration-200 animate-stagger-item">
                <h3 className="text-xl font-bold text-primary mb-4">{section.heading}</h3>
                <p className="text-foreground leading-relaxed">{section.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Hub Section */}
      <section id="hub" className="py-20 md:py-32 bg-secondary">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-divider mb-6 w-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {siteContent.travelHub.title}
            </h2>
            <p className="text-xl text-muted-foreground font-semibold mb-8">
              {siteContent.travelHub.description}
            </p>
            <p className="text-lg text-foreground leading-relaxed mb-10">
              {siteContent.travelHub.content}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {siteContent.travelHub.features.map((feature, i) => (
                <div key={i} className="flex gap-4 animate-stagger-item">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-foreground leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
              <p className="text-lg text-foreground">
                <span className="font-semibold text-primary">Future Vision:</span> {siteContent.travelHub.futureVision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Opportunities Section */}
      <section id="challenges" className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Challenges */}
            <div>
              <div className="gradient-divider mb-6 w-16"></div>
              <h2 className="text-3xl font-bold text-primary mb-8">{siteContent.challenges.title}</h2>
              <div className="space-y-6">
                {siteContent.challenges.items.map((item, i) => (
                  <Card key={i} className="p-6 border-l-4 border-accent hover:shadow-md-depth transition-all duration-200 animate-stagger-item">
                    <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-foreground leading-relaxed">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <div className="gradient-divider mb-6 w-16"></div>
              <h2 className="text-3xl font-bold text-primary mb-8">{siteContent.opportunities.title}</h2>
              <div className="space-y-6">
                {siteContent.opportunities.items.map((item, i) => (
                  <Card key={i} className="p-6 border-l-4 border-primary bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-md-depth transition-all duration-200 animate-stagger-item">
                    <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-foreground leading-relaxed">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section id="strategy" className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container">
          <div className="mb-16">
            <div className="gradient-divider mb-6 w-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {siteContent.strategy.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Short Term */}
            <div className="animate-stagger-item">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-accent" />
                {siteContent.strategy.shortTerm.heading}
              </h3>
              <ul className="space-y-4">
                {siteContent.strategy.shortTerm.initiatives.map((initiative, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                    </span>
                    <span className="text-foreground leading-relaxed">{initiative}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Long Term */}
            <div className="animate-stagger-item">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-accent" />
                {siteContent.strategy.longTerm.heading}
              </h3>
              <ul className="space-y-4">
                {siteContent.strategy.longTerm.initiatives.map((initiative, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </span>
                    <span className="text-foreground leading-relaxed">{initiative}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Operations Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Systems */}
            <div>
              <div className="gradient-divider mb-6 w-16"></div>
              <h2 className="text-3xl font-bold text-primary mb-4">{siteContent.systemsOverview.title}</h2>
              <p className="text-foreground leading-relaxed mb-8">{siteContent.systemsOverview.description}</p>
              <div className="space-y-4">
                {siteContent.systemsOverview.components.map((comp, i) => (
                  <Card key={i} className="p-4 hover:shadow-md-depth transition-all duration-200 animate-stagger-item">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-accent" />
                      {comp.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{comp.purpose}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Processes */}
            <div>
              <div className="gradient-divider mb-6 w-16"></div>
              <h2 className="text-3xl font-bold text-primary mb-4">{siteContent.processesOverview.title}</h2>
              <p className="text-foreground leading-relaxed mb-8">{siteContent.processesOverview.description}</p>
              <div className="space-y-3">
                {siteContent.processesOverview.highlights.map((highlight, i) => (
                  <div key={i} className="flex gap-3 animate-stagger-item">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-foreground leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ULIX</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Empowering independent travel agencies through technology and community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Brands</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>AVIOKARTE.HR</li>
                <li>LETALSKE.SI</li>
                <li>AVIOKARTE.ORG</li>
                <li>LOTEKSPERT.PL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Presence</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Croatia</li>
                <li>Slovenia</li>
                <li>Serbia</li>
                <li>Poland</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Report</h4>
              <p className="text-sm text-primary-foreground/80">
                Discovery Workshop Report<br />
                October 2018
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
            <p>© 2018 ULIX. All rights reserved. | Transforming Travel Through Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
