import { ChevronDown } from 'lucide-react';

/** Only 2026 exists so far, but the control is real (not a static label) so it reads as "this will keep going" rather than a one-off snapshot. */
export function YearSelector() {
  return (
    <div className="relative inline-block">
      <select
        value="2026"
        onChange={() => {}}
        title="Season"
        className="appearance-none bg-transparent border border-border rounded-md pl-3 pr-7 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="2026">2026</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
