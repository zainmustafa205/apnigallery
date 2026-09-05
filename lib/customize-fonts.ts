import {
  Poppins,
  Playfair_Display,
  Pacifico,
  Dancing_Script,
  Oswald,
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

export const CUSTOMIZE_FONT_CLASSNAMES = [
  poppins.variable,
  playfair.variable,
  pacifico.variable,
  dancingScript.variable,
  oswald.variable,
].join(" ");

export const FONT_OPTIONS = [
  { value: "var(--font-sans)", label: "Inter (Clean)" },
  { value: "var(--font-poppins)", label: "Poppins" },
  { value: "var(--font-playfair)", label: "Playfair Display" },
  { value: "var(--font-pacifico)", label: "Pacifico (Script)" },
  { value: "var(--font-dancing)", label: "Dancing Script" },
  { value: "var(--font-oswald)", label: "Oswald (Bold)" },
];
