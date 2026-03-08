import { navigationItems, siteContent } from "@/lib/content";

export const ORIGINAL_PDF_PATH = "/ULIX_DiscoveryWorkshop_Report1.pdf";
export const ATLAS_HASH_PREFIX = "#atlas-page-";

export type SearchEntry =
  | {
      id: string;
      type: "section";
      title: string;
      description: string;
      keywords: string[];
      sectionId: string;
      meta: string;
    }
  | {
      id: string;
      type: "chapter";
      title: string;
      description: string;
      keywords: string[];
      sectionId: "explorer";
      chapterId: string;
      meta: string;
    }
  | {
      id: string;
      type: "source";
      title: string;
      description: string;
      keywords: string[];
      sectionId: "atlas";
      page: number;
      meta: string;
    }
  | {
      id: string;
      type: "view";
      title: string;
      description: string;
      keywords: string[];
      sectionId: "views";
      viewId: string;
      meta: string;
    };

const sectionDescriptions: Record<string, string> = {
  overview: siteContent.hero.description,
  summary: siteContent.executiveSummary.thesis,
  views: siteContent.stakeholderViews.description,
  guide: siteContent.reportGuide.description,
  explorer: siteContent.chapterExplorer.description,
  vision: siteContent.vision.description,
  business: siteContent.businessReview.subtitle,
  "business-model": siteContent.businessModel.subtitle,
  products: siteContent.productStrategy.subtitle,
  systems: siteContent.systemsOverview.subtitle,
  hub: siteContent.travelHub.content,
  amadeus: siteContent.amadeus.description,
  roadmap: siteContent.recommendationRoadmap.description,
  strategy:
    "Short-term initiatives, long-term platform direction, and scaling priorities.",
  atlas:
    "Rendered slide collection for the most evidence-dense source pages in the original workshop PDF.",
  challenges:
    "Current operational issues and strategic opportunities identified in the workshop.",
};

export function buildSearchEntries(): SearchEntry[] {
  const sectionEntries: SearchEntry[] = navigationItems.map(item => ({
    id: `section-${item.id}`,
    type: "section",
    title: item.label,
    description: sectionDescriptions[item.id] ?? item.label,
    keywords: [item.label, item.id],
    sectionId: item.id,
    meta: "Section",
  }));

  const chapterEntries: SearchEntry[] =
    siteContent.chapterExplorer.chapters.map(chapter => ({
      id: `chapter-${chapter.id}`,
      type: "chapter",
      title: chapter.label,
      description: chapter.summary,
      keywords: [
        chapter.range,
        ...chapter.takeaways,
        ...chapter.sourcePages.map(item => `page ${item.page}`),
      ],
      sectionId: "explorer",
      chapterId: chapter.id,
      meta: `Chapter · ${chapter.range}`,
    }));

  const sourceEntries: SearchEntry[] = siteContent.sourceAtlas.map(item => ({
    id: `source-${item.page}`,
    type: "source",
    title: item.title,
    description: item.summary,
    keywords: [
      item.section,
      item.whyItMatters,
      ...item.bullets,
      `page ${item.page}`,
    ],
    sectionId: "atlas",
    page: item.page,
    meta: `Source page ${item.page}`,
  }));

  const viewEntries: SearchEntry[] = siteContent.stakeholderViews.views.map(
    view => ({
      id: `view-${view.id}`,
      type: "view",
      title: `${view.label} view`,
      description: view.summary,
      keywords: [
        view.audience,
        ...view.prompts,
        ...view.sections,
        ...view.sourcePages.map(page => `page ${page}`),
      ],
      sectionId: "views",
      viewId: view.id,
      meta: `Stakeholder · ${view.audience}`,
    })
  );

  return [
    ...sectionEntries,
    ...viewEntries,
    ...chapterEntries,
    ...sourceEntries,
  ];
}

export function getPdfPageHref(page?: number) {
  return page ? `${ORIGINAL_PDF_PATH}#page=${page}` : ORIGINAL_PDF_PATH;
}

export function formatAtlasHash(page: number) {
  return `${ATLAS_HASH_PREFIX}${page}`;
}

export function parseReportHash(hash: string) {
  if (!hash) {
    return { sectionId: "", atlasPage: null as number | null };
  }

  if (hash.startsWith(ATLAS_HASH_PREFIX)) {
    const page = Number.parseInt(hash.slice(ATLAS_HASH_PREFIX.length), 10);
    return {
      sectionId: "atlas",
      atlasPage: Number.isFinite(page) ? page : null,
    };
  }

  const sectionId = hash.replace(/^#/, "");
  return {
    sectionId,
    atlasPage: null as number | null,
  };
}
