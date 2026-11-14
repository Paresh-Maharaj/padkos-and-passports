// Turns the country names typed in the editor into map positions.
// Runs only while the site is being built — nothing here is sent to readers.
import worldCountries from 'world-countries';

export interface CountryInfo {
  name: string; // tidy common name, e.g. "Zimbabwe"
  cca3: string; // e.g. "ZWE" — used to pick the country's little map icon
  ccn3: string; // numeric code used by the world map outlines
  lat: number;
  lng: number;
  region: string; // continent, e.g. "Africa"
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

// Extra everyday names people type that the country list doesn't include.
const EXTRA: Record<string, string> = {
  england: 'GBR', scotland: 'GBR', wales: 'GBR', 'northern ireland': 'GBR', britain: 'GBR',
  america: 'USA', 'the usa': 'USA', 'united states': 'USA', 'new york': 'USA',
  holland: 'NLD', 'the netherlands': 'NLD',
  zanzibar: 'TZA', 'cape verde': 'CPV', 'czech republic': 'CZE', 'drc': 'COD', congo: 'COG',
  'south korea': 'KOR', 'north korea': 'PRK', russia: 'RUS', vietnam: 'VNM', laos: 'LAO',
  'uae': 'ARE', dubai: 'ARE', 'abu dhabi': 'ARE', bali: 'IDN', 'hong kong': 'HKG',
  'mauritius island': 'MUS', 'reunion': 'REU', 'eswatini': 'SWZ', 'turkiye': 'TUR',
};

// Positions that sit better on the map than the country's geographic centre.
const BETTER_POINT: Record<string, [number, number]> = {
  USA: [39.5, -98.5],
  FRA: [46.6, 2.4],
  NOR: [61.5, 9],
  NZL: [-41.5, 172.8],
  CAN: [56, -100],
  RUS: [58, 60],
};

const byName = new Map<string, (typeof worldCountries)[number]>();
for (const c of worldCountries) {
  const names = [c.name.common, c.name.official, c.cca2, c.cca3, ...c.altSpellings];
  for (const n of names) if (n) byName.set(norm(n), c);
}
const byCode = new Map(worldCountries.map((c) => [c.cca3, c]));

export function findCountry(name: string): CountryInfo | undefined {
  const key = norm(name);
  const c = byName.get(key) ?? byCode.get(EXTRA[key] ?? '');
  if (!c) return undefined;
  const [lat, lng] = BETTER_POINT[c.cca3] ?? (c.latlng as [number, number]);
  return { name: c.name.common, cca3: c.cca3, ccn3: c.ccn3, lat, lng, region: c.region };
}

/** Straight-line ("as the crow flies") distance in km. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Reads a point saved by the editor's map picker ({"type":"Point","coordinates":[lng,lat]}). */
export function readPoint(value: unknown): { lat: number; lng: number } | undefined {
  try {
    const g = typeof value === 'string' ? JSON.parse(value) : value;
    const [lng, lat] = (g as { coordinates: [number, number] }).coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  } catch {}
  return undefined;
}

/** Which little picture to show for each country. Anything not listed gets a camera. */
export const COUNTRY_ICON: Record<string, string> = {
  ZAF: 'tablemountain',
  EGY: 'pyramid', SDN: 'pyramid',
  ZWE: 'waterfall', ZMB: 'waterfall',
  NAM: 'dune', ARE: 'dune', OMN: 'dune', MAR: 'dune', JOR: 'dune',
  BWA: 'acacia', KEN: 'acacia', TZA: 'acacia', UGA: 'acacia', RWA: 'acacia', MWI: 'acacia', ETH: 'acacia',
  LSO: 'peaks', NPL: 'peaks', CHE: 'peaks', AUT: 'peaks', PER: 'peaks', CHL: 'peaks', ISL: 'peaks', NOR: 'peaks',
  JPN: 'torii',
  CHN: 'pagoda', THA: 'pagoda', VNM: 'pagoda', KOR: 'pagoda', KHM: 'pagoda', LAO: 'pagoda', MMR: 'pagoda',
  IND: 'dome', TUR: 'dome', PAK: 'dome', UZB: 'dome', IRN: 'dome', QAT: 'dome',
  FRA: 'tower',
  GBR: 'clocktower', IRL: 'clocktower',
  USA: 'skyline', CAN: 'skyline', SGP: 'skyline', AUS: 'skyline', HKG: 'skyline', MYS: 'skyline',
  GRC: 'temple', ITA: 'temple', ESP: 'temple', PRT: 'temple', DEU: 'temple',
  NLD: 'windmill', BEL: 'windmill', DNK: 'windmill',
  MUS: 'palm', SYC: 'palm', MDV: 'palm', MOZ: 'palm', MDG: 'palm', IDN: 'palm', REU: 'palm', CPV: 'palm', FJI: 'palm', CUB: 'palm', BRA: 'palm',
  SWZ: 'acacia',
};
