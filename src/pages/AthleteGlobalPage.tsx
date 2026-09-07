import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { Avatar } from '@/components/explorer/Avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

export default function AthleteGlobalPage() {
  const { name: encodedName } = useParams<{ name: string }>();
  const name = encodedName ? decodeURIComponent(encodedName) : '';
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<GlobalAthlete | null | undefined>(undefined);

  useEffect(() => {
    setAthlete(undefined);
    buildGlobalAthletes().then((all) => {
      setAthlete(all.find((a) => a.name === name) ?? null);
    });
  }, [name]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <Link to="/athletes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> All athletes
        </Link>

        {athlete === undefined ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : athlete === null ? (
          <p className="text-muted-foreground">No athlete found with that name.</p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <Avatar name={athlete.name} nationality={athlete.nationality} size={64} />
              <div>
                <h1 className="font-display text-3xl font-bold">
                  {athlete.name}
                  {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS] && (
                    <span className="text-base text-muted-foreground font-normal ml-2">
                      · {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS]}
                    </span>
                  )}
                </h1>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {athlete.wins} win{athlete.wins !== 1 ? 's' : ''} · {athlete.podiums} podium{athlete.podiums !== 1 ? 's' : ''} · {athlete.events.length} event{athlete.events.length !== 1 ? 's' : ''} entered
                </div>
                <div className="text-sm mt-1">
                  <span className="font-display font-bold tabular-nums">{athlete.points.toLocaleString('en-US')}</span>
                  <span className="text-muted-foreground"> points</span>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Results by competition</h3>
            <div className="space-y-2">
              {athlete.events.map((e) => (
                <button
                  key={e.slug}
                  type="button"
                  onClick={() => navigate(`/${e.slug}`, { state: { openAthlete: athlete.name } })}
                  className="w-full text-left"
                >
                  <Card className="p-4 flex items-center justify-between gap-4 flex-wrap hover:border-primary/50 transition-colors">
                    <div>
                      <div className="font-medium">{e.competition}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{e.division} · {e.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${e.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>{e.resultLabel}</div>
                        <div className="text-xs text-muted-foreground">{e.points} pts</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
