import { avatarColor, flagEmoji, initials } from './format';
import { ATHLETE_PHOTOS } from '@/data/athletePhotos';

export function Avatar({ name, nationality, size = 40 }: { name: string; nationality: string; size?: number }) {
  const flag = flagEmoji(nationality);
  const photo = ATHLETE_PHOTOS[name];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full rounded-full object-cover select-none"
          style={{ objectPosition: '50% 20%' }}
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-white select-none"
          style={{ background: avatarColor(name), fontSize: size * 0.36 }}
        >
          {initials(name)}
        </div>
      )}
      {flag && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background border border-border flex items-center justify-center leading-none"
          style={{ width: size * 0.5, height: size * 0.5, fontSize: size * 0.3 }}
        >
          {flag}
        </span>
      )}
    </div>
  );
}
