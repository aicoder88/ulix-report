import { navigationItems, siteContent } from "@/lib/content";
import { withBase } from "@/lib/assets";

export const ORIGINAL_PDF_PATH = withBase("/ULIX_DiscoveryWorkshop_Report1.pdf");
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
      type: "source";
      title: string;
      description: string;
      keywords: string[];
      sectionId: "proof";
      page: number;
      meta: string;
    };

const sectionDescriptions: Record<string, string> = {
  preface: siteContent.preface.description,
  urgency: siteContent.transformationNarrative.urgency.lead,
  commitments: siteContent.operatingCommitments.intro,
  platform: siteContent.transformationNarrative.platform.lead,
  friction: siteContent.transformationNarrative.friction.lead,
  roadmap: siteContent.transformationNarrative.roadmap.lead,
  proof: siteContent.proofLayer.description,
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
      "proof",
      "source",
    ],
    sectionId: "proof",
    page: item.page,
    meta: `Proof page ${item.page}`,
  }));

  return [...sectionEntries, ...sourceEntries];
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
      sectionId: "proof",
      atlasPage: Number.isFinite(page) ? page : null,
    };
  }

  const sectionId = hash.replace(/^#/, "");
  return {
    sectionId,
    atlasPage: null as number | null,
  };
}
