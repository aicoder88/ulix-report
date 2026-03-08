import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteContent } from "@/lib/content";
import { getPdfPageHref } from "@/lib/report";

type SourceAtlasItem = (typeof siteContent.sourceAtlas)[number];

type SourceAtlasDialogProps = {
  item: SourceAtlasItem | null;
  onOpenChange: (open: boolean) => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenPage: (page: number) => void;
  onOpenPdf: (page?: number, surface?: string) => void;
};

export function SourceAtlasDialog({
  item,
  onOpenChange,
  onJumpToSection,
  onOpenPage,
  onOpenPdf,
}: SourceAtlasDialogProps) {
  const currentIndex = item
    ? siteContent.sourceAtlas.findIndex(entry => entry.page === item.page)
    : -1;
  const previousItem =
    currentIndex > 0 ? siteContent.sourceAtlas[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < siteContent.sourceAtlas.length - 1
      ? siteContent.sourceAtlas[currentIndex + 1]
      : null;

  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      {item && (
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-none">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-secondary/30 border-b lg:border-b-0 lg:border-r border-border">
              <img
                src={item.image}
                alt={`${item.title} from page ${item.page}`}
                className="w-full h-full object-contain object-top max-h-[78vh]"
              />
            </div>
            <div className="max-h-[78vh] overflow-y-auto p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Source page {item.page}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.section}
                </span>
              </div>

              <DialogTitle className="text-3xl font-extrabold text-foreground mb-3">
                {item.title}
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-muted-foreground mb-6">
                {item.summary}
              </DialogDescription>

              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <button
                  type="button"
                  onClick={() => onJumpToSection(item.narrativeSectionId)}
                  className="rounded-2xl border border-border p-4 text-left hover:border-primary/30"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                    Back to web summary
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    Return to the narrative section that explains this source in
                    the web version.
                  </p>
                </button>
                <a
                  href={getPdfPageHref(item.page)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onOpenPdf(item.page, "atlas-dialog")}
                  className="rounded-2xl border border-border p-4 text-left hover:border-primary/30"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                    Open original PDF
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    Jump directly into the original deck at page {item.page}.
                  </p>
                </a>
              </div>

              <div className="rounded-2xl bg-primary/5 p-5 mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                  Why this page matters
                </p>
                <p className="text-foreground/85 leading-relaxed">
                  {item.whyItMatters}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-3">
                  What to notice
                </p>
                <ul className="space-y-3">
                  {item.bullets.map(bullet => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-border/70 p-4"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <p className="text-foreground/85 leading-relaxed">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-border/70 pt-6">
                {previousItem && (
                  <button
                    type="button"
                    onClick={() => onOpenPage(previousItem.page)}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  >
                    Previous source page
                  </button>
                )}
                {nextItem && (
                  <button
                    type="button"
                    onClick={() => onOpenPage(nextItem.page)}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  >
                    Next source page
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onJumpToSection("proof")}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  View full proof atlas
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
