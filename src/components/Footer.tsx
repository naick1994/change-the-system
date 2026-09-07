import { ArrowUpRight } from 'lucide-react';
import { DeployTag } from './DeployTag';
import nickAvatar from '@/assets/nick-avatar.jpg';

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border py-8">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <a
          href="https://naick1994.github.io/about-nick/about-nick"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <img src={nickAvatar} alt="Nicholas Baruffaldi" className="w-7 h-7 rounded-full object-cover border border-border" />
          Built and prototyped by Nicholas Baruffaldi
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <DeployTag />
    </footer>
  );
}
