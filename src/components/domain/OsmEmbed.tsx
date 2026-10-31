// A free OpenStreetMap embed (no key, no package). A pin is drawn only when real coordinates are given; otherwise
// the map is centred on Doha, the one location the data does support, and says so.

const DOHA = { lat: 25.2854, lon: 51.531 };

interface OsmEmbedProps {
  latitude?: number;
  longitude?: number;
  /** Accessible title of the map frame. */
  title: string;
  /** Fill the height of the parent (a flex column) instead of a fixed height. */
  fill?: boolean;
  /** Height of the map frame when not filling. */
  heightClassName?: string;
  className?: string;
}

const bbox = (lat: number, lon: number, dLat: number, dLon: number) => `${lon - dLon},${lat - dLat},${lon + dLon},${lat + dLat}`;

export function OsmEmbed({ latitude, longitude, title, fill = false, heightClassName = 'h-64', className = '' }: OsmEmbedProps) {
  const hasPin = typeof latitude === 'number' && typeof longitude === 'number';
  const lat = hasPin ? latitude : DOHA.lat;
  const lon = hasPin ? longitude : DOHA.lon;
  const box = hasPin ? bbox(lat, lon, 0.004, 0.006) : bbox(lat, lon, 0.07, 0.1);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik${hasPin ? `&marker=${lat},${lon}` : ''}`;
  return (
    <div className={`${fill ? 'flex-1 flex flex-col' : ''} ${className}`}>
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`block w-full ${fill ? 'flex-1 min-h-80' : heightClassName} rounded-[var(--radius-card)] border border-border-soft`}
      />
      {!hasPin && <p className="pt-2 text-[length:var(--fs-caption)] text-muted">No coordinates are on file for this address, so the map shows Doha.</p>}
    </div>
  );
}
