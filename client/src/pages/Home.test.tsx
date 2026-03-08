import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";

vi.mock("@/lib/analytics", () => ({
  canTrackReportEvents: () => false,
  trackReportEvent: vi.fn(),
}));

describe("Home hash navigation", () => {
  it("activates the matching section from the URL hash", async () => {
    window.location.hash = "#summary";

    render(<Home />);

    await waitFor(() => {
      const activeSummaryButton = screen
        .getAllByRole("button", { name: "Summary" })
        .find(button => button.getAttribute("aria-current") === "location");

      expect(activeSummaryButton).toBeTruthy();
    });
  });

  it("opens the atlas dialog when the hash targets a source page", async () => {
    window.location.hash = "#atlas-page-55";

    render(<Home />);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Quick wins shortlist")).toBeTruthy();
  });
});
