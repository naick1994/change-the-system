import type { ReactNode } from 'react';

/** A running section head: small mono-caps label, then a hairline rule filling the remaining width. Used instead of a boxed container at every major section break, so a page reads as one continuous sheet rather than a stack of cards. `delay` opts into the page's rise-in entrance animation (see index.css), matching the pattern used on Home. */
export function SectionHead({ children, className = '', delay }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`flex items-center gap-4 mb-5 ${delay != null ? 'rise-in' : ''} ${className}`}
      style={delay != null ? { animationDelay: `${delay}ms` } : undefined}
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground shrink-0">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
