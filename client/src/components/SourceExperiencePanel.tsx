import { Card } from "@/components/ui/card";
import { siteContent } from "@/lib/content";
import { getPdfPageHref } from "@/lib/report";

type SourceExperiencePanelProps = {
  onJumpToSection: (sectionId: string) => void;
  onOpenPdf: (page?: number, surface?: string) => void;
};

export function SourceExperiencePanel({
  onJumpToSection,
  onOpenPdf,
}: SourceExperiencePanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] items-start">
      <Card className="border-none p-7 shadow-sm bg-background">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
          Web summary path
        </p>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Move from orientation to action
        </h3>
        <div className="space-y-3">
          {siteContent.sourceExperience.summaryPath.map(item => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/20 p-4"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="text-sm leading-relaxed text-foreground/85">
                {item}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onJumpToSection("summary")}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Open summary
          </button>
          <button
            type="button"
            onClick={() => onJumpToSection("views")}
            className="rounded-full border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Browse stakeholder views
          </button>
        </div>
      </Card>

      <Card className="border-none p-7 shadow-sm bg-foreground text-background">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
          Source fidelity path
        </p>
        <h3 className="text-2xl font-bold mb-4">Verify in the original deck</h3>
        <div className="space-y-3">
          {siteContent.sourceExperience.sourcePath.map(item => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-background/10 bg-background/5 p-4"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="text-sm leading-relaxed text-background/80">
                {item}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onJumpToSection("atlas")}
            className="rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Open source atlas
          </button>
          <a
            href={getPdfPageHref()}
            target="_blank"
            rel="noreferrer"
            onClick={() => onOpenPdf(undefined, "source-experience")}
            className="rounded-full border border-background/20 px-5 py-2.5 text-sm font-semibold text-background hover:bg-background/5"
          >
            Download original PDF
          </a>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-background/70">
          {siteContent.sourceExperience.confidentiality}
        </p>
      </Card>
    </div>
  );
}
