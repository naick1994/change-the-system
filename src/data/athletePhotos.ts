import menManifest from './athletePhotoManifest.men.json';
import womenManifest from './athletePhotoManifest.women.json';

// Eagerly imports every headshot so Vite fingerprints/base-path-resolves
// them like any other asset; keyed by the same absolute path the manifests'
// filenames resolve to.
const images = import.meta.glob('/src/assets/athletes/**/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

function buildMap(manifest: Record<string, string>, subdir: 'men' | 'women'): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [name, filename] of Object.entries(manifest)) {
    const path = `/src/assets/athletes/${subdir}/${filename}`;
    if (images[path]) map[name] = images[path];
  }
  return map;
}

/** Real headshots for athletes confirmed at Cold Hawaii Big Air 2026 (source: official athlete roster). Athletes not in this map fall back to initials avatars — never a placeholder photo. */
export const ATHLETE_PHOTOS: Record<string, string> = {
  ...buildMap(menManifest, 'men'),
  ...buildMap(womenManifest, 'women'),
};
