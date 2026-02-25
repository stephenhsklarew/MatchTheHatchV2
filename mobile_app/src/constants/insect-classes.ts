export interface InsectClassInfo {
  id: string;
  scientificName: string;
  commonName: string;
  description: string;
  isAquatic: boolean;
  flyPatterns: string[];
}

export const INSECT_CLASSES: InsectClassInfo[] = [
  {
    id: 'ephemeroptera',
    scientificName: 'Ephemeroptera',
    commonName: 'Mayfly',
    description: 'Delicate insects with upright wings, found near streams and rivers. Key indicator of water quality.',
    isAquatic: true,
    flyPatterns: ['Adams', 'Parachute Adams', 'Blue Winged Olive', 'Pale Morning Dun', 'March Brown'],
  },
  {
    id: 'plecoptera',
    scientificName: 'Plecoptera',
    commonName: 'Stonefly',
    description: 'Robust insects with flat wings folded over the body. Prefer cold, well-oxygenated streams.',
    isAquatic: true,
    flyPatterns: ['Stimulator', 'Pat\'s Rubber Legs', 'Golden Stone', 'Salmonfly', 'Little Yellow Sally'],
  },
  {
    id: 'trichoptera',
    scientificName: 'Trichoptera',
    commonName: 'Caddisfly',
    description: 'Moth-like insects with tent-shaped wings. Larvae build protective cases from debris.',
    isAquatic: true,
    flyPatterns: ['Elk Hair Caddis', 'Goddard Caddis', 'X-Caddis', 'Peeking Caddis', 'Green Rockworm'],
  },
  {
    id: 'araneae',
    scientificName: 'Araneae',
    commonName: 'Spider',
    description: 'Eight-legged arachnids. Not an aquatic insect — not useful for fly pattern matching.',
    isAquatic: false,
    flyPatterns: [],
  },
  {
    id: 'coleoptera',
    scientificName: 'Coleoptera',
    commonName: 'Beetle',
    description: 'Hard-shelled insects with wing covers. Not typically a primary aquatic insect order for fly fishing.',
    isAquatic: false,
    flyPatterns: [],
  },
];

export const CLASS_LABELS = INSECT_CLASSES.map((c) => c.scientificName);

export function getClassInfo(scientificName: string): InsectClassInfo | undefined {
  return INSECT_CLASSES.find(
    (c) => c.scientificName.toLowerCase() === scientificName.toLowerCase()
  );
}
