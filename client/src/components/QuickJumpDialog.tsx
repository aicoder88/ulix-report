import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import type { SearchEntry } from "@/lib/report";

type QuickJumpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: SearchEntry[];
  onSelect: (entry: SearchEntry) => void;
};

const groupLabels: Record<SearchEntry["type"], string> = {
  section: "Sections",
  source: "Proof pages",
};

export function QuickJumpDialog({
  open,
  onOpenChange,
  entries,
  onSelect,
}: QuickJumpDialogProps) {
  const groups = {
    section: entries.filter(entry => entry.type === "section"),
    source: entries.filter(entry => entry.type === "source"),
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Quick jump"
      description="Search sections and proof pages."
      className="max-w-2xl"
    >
      <CommandInput placeholder="Search the report, a page, or a stakeholder path..." />
      <CommandList>
        <CommandEmpty>No matching sections or source pages.</CommandEmpty>
        {(Object.keys(groups) as Array<SearchEntry["type"]>).map(group => {
          if (groups[group].length === 0) {
            return null;
          }

          return (
            <CommandGroup key={group} heading={groupLabels[group]}>
              {groups[group].map(entry => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.title} ${entry.description} ${entry.keywords.join(" ")}`}
                  onSelect={() => {
                    onSelect(entry);
                    onOpenChange(false);
                  }}
                  className="items-start py-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {entry.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                  <CommandShortcut>{entry.meta}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
