import {
  Poppins,
  Playfair_Display,
  Pacifico,
  Dancing_Script,
  Oswald,
  Bebas_Neue,
  Lobster,
  Caveat,
  Merriweather,
  Comfortaa,
  Mirza,
  Noto_Naskh_Arabic,
  Lateef,
} from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
});
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-oswald",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
});
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comfortaa",
});
const mirza = Mirza({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-mirza",
});
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-naskh",
});
const lateef = Lateef({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-lateef",
});

// NOTE: Noto Nastaliq Urdu (--font-urdu) and Gulzar (--font-heading-ur) are
// intentionally NOT re-loaded here — both already load once in app/layout.tsx.

export const CUSTOMIZE_FONT_CLASSNAMES = [
  poppins.variable,
  playfair.variable,
  pacifico.variable,
  dancingScript.variable,
  oswald.variable,
  bebasNeue.variable,
  lobster.variable,
  caveat.variable,
  merriweather.variable,
  comfortaa.variable,
  mirza.variable,
  notoNaskhArabic.variable,
  lateef.variable,
].join(" ");

export interface FontOption {
  value: string;
  label: string;
  script: "latin" | "urdu";
}

export const FONT_OPTIONS: FontOption[] = [
  { value: "var(--font-sans)", label: "Inter (Clean)", script: "latin" },
  { value: "var(--font-poppins)", label: "Poppins", script: "latin" },
  { value: "var(--font-playfair)", label: "Playfair Display", script: "latin" },
  { value: "var(--font-pacifico)", label: "Pacifico (Script)", script: "latin" },
  { value: "var(--font-dancing)", label: "Dancing Script", script: "latin" },
  { value: "var(--font-oswald)", label: "Oswald (Bold)", script: "latin" },
  { value: "var(--font-bebas)", label: "Bebas Neue (Impact)", script: "latin" },
  { value: "var(--font-lobster)", label: "Lobster", script: "latin" },
  { value: "var(--font-caveat)", label: "Caveat (Handwriting)", script: "latin" },
  { value: "var(--font-merriweather)", label: "Merriweather (Serif)", script: "latin" },
  { value: "var(--font-comfortaa)", label: "Comfortaa (Rounded)", script: "latin" },
  { value: "var(--font-urdu)", label: "Noto Nastaliq (اردو)", script: "urdu" },
  { value: "var(--font-heading-ur)", label: "Gulzar (اردو)", script: "urdu" },
  { value: "var(--font-mirza)", label: "Mirza Nastaliq (اردو)", script: "urdu" },
  { value: "var(--font-naskh)", label: "Noto Naskh (اردو)", script: "urdu" },
  { value: "var(--font-lateef)", label: "Lateef (اردو)", script: "urdu" },
];

// Unicode ranges covering Arabic/Urdu script characters
const URDU_SCRIPT_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function isUrduScript(text: string): boolean {
  return URDU_SCRIPT_REGEX.test(text);
}
