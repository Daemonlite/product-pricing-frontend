"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

type PrimaryColor =
  | "brand"
  | "blue"
  | "purple"
  | "pink"
  | "green"
  | "orange"
  | "red"
  | "yellow"
  | "magenta";

type FontFamily =
  | "outfit"
  | "inter"
  | "roboto"
  | "open-sans"
  | "poppins"
  | "montserrat"
  | "lato"
  | "libre-baskerville"
  | "jetbrains-mono"
  | "system";

interface ThemeCustomizerContextType {
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  isCustomizerOpen: boolean;
  toggleCustomizer: () => void;
}

export const colorPalettes = {
  brand: {
    25: "#f2f7ff",
    50: "#ecf3ff",
    100: "#dde9ff",
    200: "#c2d6ff",
    300: "#9cb9ff",
    400: "#7592ff",
    500: "#465fff",
    600: "#3641f5",
    700: "#2a31d8",
    800: "#252dae",
    900: "#262e89",
    950: "#161950",
  },
  blue: {
    25: "#f5fbff",
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#b9e6fe",
    300: "#7cd4fd",
    400: "#36bffa",
    500: "#0ba5ec",
    600: "#0086c9",
    700: "#026aa2",
    800: "#065986",
    900: "#0b4a6f",
    950: "#062c41",
  },
  purple: {
    25: "#fafaff",
    50: "#f4f3ff",
    100: "#ebe9fe",
    200: "#d9d6fe",
    300: "#bdb4fe",
    400: "#9b8afb",
    500: "#7a5af8",
    600: "#6938ef",
    700: "#5925dc",
    800: "#4a1fb8",
    900: "#3e1c96",
    950: "#2e1b69",
  },
  pink: {
    25: "#fef7ff",
    50: "#fdf2fa",
    100: "#fce7f6",
    200: "#fcceee",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },
  green: {
    25: "#f6fef9",
    50: "#ecfdf3",
    100: "#d1fadf",
    200: "#a6f4c5",
    300: "#6ce9a6",
    400: "#32d583",
    500: "#12b76a",
    600: "#039855",
    700: "#027a48",
    800: "#05603a",
    900: "#054f31",
    950: "#053321",
  },
  orange: {
    25: "#fffaf5",
    50: "#fff6ed",
    100: "#ffead5",
    200: "#fddcab",
    300: "#feb273",
    400: "#fd853a",
    500: "#fb6514",
    600: "#ec4a0a",
    700: "#c4320a",
    800: "#9c2a10",
    900: "#7e2410",
    950: "#511c10",
  },
  red: {
    25: "#fffbfa",
    50: "#fef3f2",
    100: "#fee4e2",
    200: "#fecdca",
    300: "#fda29b",
    400: "#f97066",
    500: "#f04438",
    600: "#d92d20",
    700: "#b42318",
    800: "#912018",
    900: "#7a271a",
    950: "#55160c",
  },
  yellow: {
    25: "#fffcf2",
    50: "#fff9e6",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#facc15",
    600: "#eab308",
    700: "#ca8a04",
    800: "#a16207",
    900: "#854d0e",
    950: "#713f12",
  },
  magenta: {
    25: "#fef8ff",
    50: "#fdf4fe",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e",
  },
};

const fontOptions = {
  outfit: {
    name: "Outfit",
    family: '"Outfit", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  inter: {
    name: "Inter",
    family: '"Inter", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  roboto: {
    name: "Roboto",
    family: '"Roboto", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 300, 400, 500, 700, 900],
  },
  "open-sans": {
    name: "Open Sans",
    family: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
  },
  poppins: {
    name: "Poppins",
    family: '"Poppins", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  montserrat: {
    name: "Montserrat",
    family: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  lato: {
    name: "Lato",
    family: '"Lato", ui-sans-serif, system-ui, sans-serif',
    weights: [100, 300, 400, 700, 900],
  },
  "libre-baskerville": {
    name: "Libre Baskerville",
    family: '"Libre Baskerville", serif',
    weights: [400, 700],
  },
  "jetbrains-mono": {
    name: "JetBrains Mono",
    family: '"JetBrains Mono", ui-monospace, monospace',
    weights: [400, 500, 700],
  },
  system: {
    name: "System",
    family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    weights: [400, 500, 600, 700],
  },
};

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

export const ThemeCustomizerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { resolvedTheme } = useNextTheme();
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>("brand");
  const [fontFamily, setFontFamily] = useState<FontFamily>("outfit");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem("primaryColor") as PrimaryColor | null;
    if (savedColor && colorPalettes[savedColor]) {
      setPrimaryColor(savedColor);
    }

    const savedFont = localStorage.getItem("fontFamily") as FontFamily | null;
    if (savedFont && fontOptions[savedFont]) {
      setFontFamily(savedFont);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);

    // Apply primary color
    const root = document.documentElement;
    const colors = colorPalettes[primaryColor];

    if (!colors) {
      console.warn(`Color palette for primaryColor '${primaryColor}' not found.`);
      return;
    }

    // Set Tailwind colors based on theme
    const primaryShade = resolvedTheme === 'dark' ? 400 : 500;
    const primaryHex = colors[primaryShade];
    if (!primaryHex) {
      console.warn(`Primary shade '${primaryShade}' not found in color palette for '${primaryColor}'.`);
      return;
    }
    const [ph, ps, pl] = hexToHsl(primaryHex);
    root.style.setProperty('--primary', `${ph} ${ps}% ${pl}%`);
    root.style.setProperty('--primary-foreground', pl > 50 ? '222.2 84% 4.9%' : '210 40% 98%');

    const secondaryShade = resolvedTheme === 'dark' ? 800 : 100;
    const secondaryHex = colors[secondaryShade];
    if (!secondaryHex) {
      console.warn(`Secondary shade '${secondaryShade}' not found in color palette for '${primaryColor}'.`);
      return;
    }
    const [sh, ss, sl] = hexToHsl(secondaryHex);
    root.style.setProperty('--secondary', `${sh} ${ss}% ${sl}%`);

    const accentShade = resolvedTheme === 'dark' ? 700 : 200;
    const accentHex = colors[accentShade];
    if (!accentHex) {
      console.warn(`Accent shade '${accentShade}' not found in color palette for '${primaryColor}'.`);
      return;
    }
    const [ah, as_, al] = hexToHsl(accentHex);
    root.style.setProperty('--accent', `${ah} ${as_}% ${al}%`);
  }, [primaryColor, resolvedTheme]);

  useEffect(() => {
    localStorage.setItem("fontFamily", fontFamily);
    console.log('Font family changed to:', fontFamily);

    // Apply font family directly to root for global inheritance
    const root = document.documentElement;
    const font = fontOptions[fontFamily];
    if (font && font.family) {
      root.style.fontFamily = font.family;
      console.log('Applied font family:', font.family);
    }
  }, [fontFamily]);

  const toggleCustomizer = () => {
    setIsCustomizerOpen((prev) => !prev);
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        fontFamily,
        setFontFamily,
        isCustomizerOpen,
        toggleCustomizer,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
};

export const useThemeCustomizer = () => {
  const context = useContext(ThemeCustomizerContext);
  if (context === undefined) {
    throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider");
  }
  return context;
};

// Backward compatibility export for old useTheme
export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  return {
    theme: theme || "light",
    toggleTheme: () => setTheme(theme === "light" ? "dark" : "light")
  };
};

// Export font options for use in components
export { fontOptions };
export type { FontFamily };
