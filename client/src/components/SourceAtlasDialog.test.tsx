import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SourceAtlasDialog } from "@/components/SourceAtlasDialog";
import { siteContent } from "@/lib/content";

describe("SourceAtlasDialog", () => {
  it("supports summary navigation, PDF jumps, and adjacent pages", async () => {
    const user = userEvent.setup();
    const handleJumpToSection = vi.fn();
    const handleOpenPage = vi.fn();
    const handleOpenPdf = vi.fn();
    const item = siteContent.sourceAtlas.find(entry => entry.page === 55)!;

    render(
      <SourceAtlasDialog
        item={item}
        onOpenChange={vi.fn()}
        onJumpToSection={handleJumpToSection}
        onOpenPage={handleOpenPage}
        onOpenPdf={handleOpenPdf}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /back to web summary/i })
    );
    expect(handleJumpToSection).toHaveBeenCalledWith("roadmap");

    const pdfLink = screen.getByRole("link", { name: /open original pdf/i });
    expect(pdfLink.getAttribute("href")).toBe(
      "/ULIX_DiscoveryWorkshop_Report1.pdf#page=55"
    );
    await user.click(pdfLink);
    expect(handleOpenPdf).toHaveBeenCalledWith(55, "atlas-dialog");

    await user.click(screen.getByRole("button", { name: /next source page/i }));
    expect(handleOpenPage).toHaveBeenCalledWith(56);
  });
});
