import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuickJumpDialog } from "@/components/QuickJumpDialog";
import { buildSearchEntries } from "@/lib/report";

describe("QuickJumpDialog", () => {
  it("returns matching source pages through search", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <QuickJumpDialog
        open
        onOpenChange={handleOpenChange}
        entries={buildSearchEntries()}
        onSelect={handleSelect}
      />
    );

    await user.type(
      screen.getByPlaceholderText(
        "Search the report, a page, or a stakeholder path..."
      ),
      "page 55"
    );

    await user.click(screen.getByText("Quick wins shortlist"));

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "source",
        page: 55,
        title: "Quick wins shortlist",
      })
    );
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
