import { Link, useLocation } from 'react-router-dom';
import { Waves } from 'lucide-react';

export function NavBar() {
  const { pathname } = useLocation();
  const isAthletes = pathname.startsWith('/athletes');
  const isHome = pathname === '/';
  const isCompetitions = !isAthletes && !isHome;

  return (
    <div className="relative border-b border-border">
      <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-foreground hover:text-primary transition-colors">
          <Waves className="w-3.5 h-3.5" /> Megaloop
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/competitions"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isCompetitions ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Competitions
          </Link>
          <Link
            to="/athletes"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isAthletes ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Athletes
          </Link>
        </nav>
      </div>
    </div>
  );
}
