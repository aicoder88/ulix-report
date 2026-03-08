import { Card } from "@/components/ui/card";
import { navigationItems, siteContent } from "@/lib/content";
import { getPdfPageHref } from "@/lib/report";

type StakeholderView = (typeof siteContent.stakeholderViews.views)[number];

type StakeholderPathsProps = {
  activeViewId: string;
  onSelectView: (viewId: string) => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenSourcePage: (page: number) => void;
  onOpenPdf: (page?: number, surface?: string) => void;
};

const sectionLabelMap = new Map(
  navigationItems.map(item => [item.id, item.label] as const)
);

export function StakeholderPaths({
  activeViewId,
  onSelectView,
  onJumpToSection,
  onOpenSourcePage,
  onOpenPdf,
}: StakeholderPathsProps) {
  return (
    <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
      <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {siteContent.stakeholderViews.views.map(view => {
          const isActive = view.id === activeViewId;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onSelectView(view.id)}
              className="text-left"
            >
              <Card
                className={`h-full border-none p-6 transition-all ${
                  isActive
                    ? "bg-foreground text-background shadow-lg"
                    : "bg-background shadow-sm hover:shadow-md"
                }`}
              >
                <p
                  className={`text-sm font-bold uppercase tracking-[0.18em] ${
                    isActive ? "text-primary" : "text-primary"
                  } mb-3`}
                >
                  {view.audience}
                </p>
                <h3 className="text-2xl font-bold mb-3">{view.label}</h3>
                <p
                  className={`text-xl leading-relaxed ${
                    isActive ? "text-background/75" : "text-muted-foreground"
                  }`}
                >
                  {view.summary}
                </p>
              </Card>
            </button>
          );
        })}
      </div>

      <StakeholderDetail
        view={
          siteContent.stakeholderViews.views.find(
            view => view.id === activeViewId
          ) ?? siteContent.stakeholderViews.views[0]
        }
        onJumpToSection={onJumpToSection}
        onOpenSourcePage={onOpenSourcePage}
        onOpenPdf={onOpenPdf}
      />
    </div>
  );
}

function StakeholderDetail({
  view,
  onJumpToSection,
  onOpenSourcePage,
  onOpenPdf,
}: {
  view: StakeholderView;
  onJumpToSection: (sectionId: string) => void;
  onOpenSourcePage: (page: number) => void;
  onOpenPdf: (page?: number, surface?: string) => void;
}) {
  return (
    <Card className="border-none p-7 md:p-8 shadow-sm bg-background">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Recommended entry path
          </p>
          <h3 className="text-3xl font-bold text-foreground mb-3">
            {view.label} working route
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {view.summary}
          </p>
        </div>
        <a
          href={getPdfPageHref(view.sourcePages[0])}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            onOpenPdf(view.sourcePages[0], `stakeholder-${view.id}`)
          }
          className="inline-flex items-center justify-center rounded-full border border-primary/20 px-5 py-2.5 text-xl font-semibold text-primary hover:bg-primary/5"
        >
          Open original PDF
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Start with these sections
          </p>
          <div className="flex flex-wrap gap-3">
            {view.sections.map(sectionId => (
              <button
                key={sectionId}
                type="button"
                onClick={() => onJumpToSection(sectionId)}
                className="rounded-full border border-border px-4 py-2 text-xl font-semibold text-foreground hover:border-primary/30 hover:text-primary"
              >
                {sectionLabelMap.get(sectionId) ?? sectionId}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Validate in source pages
          </p>
          <div className="flex flex-wrap gap-3">
            {view.sourcePages.map(page => (
              <button
                key={page}
                type="button"
                onClick={() => onOpenSourcePage(page)}
                className="rounded-full bg-primary/10 px-4 py-2 text-xl font-semibold text-primary hover:bg-primary/15"
              >
                Page {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary mb-3">
          Reader prompts
        </p>
        <div className="grid gap-3">
          {view.prompts.map(prompt => (
            <div
              key={prompt}
              className="rounded-2xl border border-border/70 bg-secondary/20 p-4"
            >
              <p className="text-xl leading-relaxed text-foreground/85">
                {prompt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
