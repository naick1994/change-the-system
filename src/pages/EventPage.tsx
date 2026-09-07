import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { getEventBySlug } from '@/data/eventsIndex';
import type { BigAirEventData } from '@/types/bigAirEvent';
import { Explorer } from '@/components/explorer/Explorer';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const event = slug ? getEventBySlug(slug) : undefined;
  const [data, setData] = useState<BigAirEventData | null>(null);
  // Set when navigated here from an athlete's global profile page (see
  // AthleteGlobalPage), so Explorer can jump straight to that athlete's
  // detail instead of the leaderboard.
  const initialAthlete = (location.state as { openAthlete?: string } | null)?.openAthlete;

  useEffect(() => {
    setData(null);
    event?.loadData().then(setData);
  }, [event]);

  if (!event) return <Navigate to="/competitions" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-6xl py-14">
        <Link to="/competitions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> All competitions
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">{event.name}</h1>
        <p className="text-muted-foreground mb-8">{event.location} · {event.date}</p>

        {data ? (
          <Explorer data={data} initialAthlete={initialAthlete} />
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
