import { Link, useLocation } from 'react-router-dom';
import { Waves } from 'lucide-react';

export function NavBar() {
  const { pathname } = useLocation();
  const isAthletes = pathname.startsWith('/athletes');
  const isBrands = pathname.startsWith('/brands');
  const isHome = pathname === '/';
  const isCompetitions = !isAthletes && !isBrands && !isHome;

  return (
    <div className="relative border-b border-border">
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors">
          <Waves className="w-3.5 h-3.5" /> Home
        </Link>
        <nav className="flex items-center gap-7 h-full">
          <Link
            to="/competitions"
            className={`h-full flex items-center text-sm border-b-2 transition-colors ${isCompetitions ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Competitions
          </Link>
          <Link
            to="/athletes"
            className={`h-full flex items-center text-sm border-b-2 transition-colors ${isAthletes ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Athletes
          </Link>
          <Link
            to="/brands"
            className={`h-full flex items-center text-sm border-b-2 transition-colors ${isBrands ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Brands
          </Link>
        </nav>
      </div>
    </div>
  );
}
