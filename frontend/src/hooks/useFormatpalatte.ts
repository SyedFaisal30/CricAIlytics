// formatPalette.ts
// Single source of truth for per-format colors.
// Every component should import this and derive ALL colors from it.

export type FormatPalette = {
  primary: string;    // main accent (batting, primary stats)
  secondary: string;  // bowling / secondary stats
  tertiary: string;   // fielding / auxiliary
  muted: string;      // neutral stats
};

const PALETTES: Record<string, FormatPalette> = {
  // Test: The "Ink and Paper" look (Classic & Sharp but soft)
  Test: {
    primary:   "#3D405B", 
    secondary: "#3D405B", 
    tertiary:  "#3D405B", 
    muted:     "#3D405B", 
  },
  // ODI: The "Ocean Mist" look (Calm & Wide)
  ODI: {
    primary:   "#5F7ADB", // Dusty Cornflower Blue
    secondary: "#5F7ADB", // Soft Sky
    tertiary:  "#5F7ADB", // Pale Mist
    muted:     "#5F7ADB", // Arctic White
  },
  // T20I: The "Twilight" look (Modern & Softened)
  T20I: {
    primary:   "#8E7DBE", // Dusty Heather/Lavender
    secondary: "#8E7DBE", // Soft Mauve
    tertiary:  "#8E7DBE", // Pale Thistle
    muted:     "#8E7DBE ", // Petal White
  },
  // IPL: The "Autumn/Gold" look (Warm & Friendly)
  IPL: {
    primary:   "#B97A57", // Muted Copper/Clay
    secondary: "#B97A57", // Sandy Tan
    tertiary:  "#B97A57", // Soft Ochre
    muted:     "#B97A57", // Cream Corn
  },
};

const DEFAULT_PALETTE: FormatPalette = {
  primary:   "#2563EB",
  secondary: "#7C3AED",
  tertiary:  "#0891B2",
  muted:     "#64748B",
};

export const getPalette = (formatName: string): FormatPalette =>
  PALETTES[formatName] ?? DEFAULT_PALETTE;


// formatPalette.ts
// Single source of truth for per-format colors.
// Every component should import this and derive ALL colors from it.

export type YearWiseFormatPalette = {
  primary: string;    // main accent (batting, primary stats)
  secondary: string;  // bowling / secondary stats
  tertiary: string;   // fielding / auxiliary
  muted: string;      // neutral stats
};

const YEARWISE_PALETTES: Record<string, YearWiseFormatPalette> = {
  // Test: The "Ink and Paper" look (Classic & Sharp but soft)
  Test: {
    primary:   "#2E3A52",
    secondary: "#4A5A7A",
    tertiary:  "#6B7FA0",
    muted:     "#9BAAC4",
  },
 
  // ODI — "Ocean" family: cobalt → cornflower → sky → mist
  ODI: {
    primary:   "#2F5FCC",
    secondary: "#5F7ADB",
    tertiary:  "#8DA5E8",
    muted:     "#BDD0F5",
  },
 
  // T20I — "Dusk" family: deep violet → heather → lavender → thistle
  T20I: {
    primary:   "#5B3FA6",
    secondary: "#7D6BBF",
    tertiary:  "#A395D4",
    muted:     "#C8BFE7",
  },
 
  // IPL — "Copper" family: burnt sienna → clay → sand → cream
  IPL: {
    primary:   "#9A5B32",
    secondary: "#B97A57",
    tertiary:  "#D09E80",
    muted:     "#E8C9B0",
  },
};

const DEFAULT_YEARWISE_PALETTE: YearWiseFormatPalette = {
  primary:   "#2563EB",
  secondary: "#7C3AED",
  tertiary:  "#0891B2",
  muted:     "#64748B",
};

export const getYearWisePalette = (formatName: string): YearWiseFormatPalette =>
  YEARWISE_PALETTES[formatName] ?? DEFAULT_YEARWISE_PALETTE;