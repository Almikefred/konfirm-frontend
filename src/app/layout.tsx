import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "./RouteAnnouncer";
import ThemeToggle from "./ThemeToggle";

// Self-hosted by Next at build time (no runtime request to Google Fonts).
// Only the landing page's `.serif-em` / `.feature-num` rules read this
// variable, so no other route changes font. Italic-only: it's used solely
// for the bold-sans/italic-serif headline emphasis device.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-display",
  display: "swap",
});

// Runs before paint so an explicit saved preference applies immediately --
// without this, the page would render in the system-preference theme for
// one frame, then flash to the user's actual saved choice.
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem("konfirm_theme");
  if (t === "light" || t === "dark") {
    document.documentElement.setAttribute("data-theme", t);
  }
} catch (e) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://konfirm.xyz"),
  title: {
    template: "%s · Konfirm",
    default: "Konfirm",
  },
  description: "A non-custodial payment processor on Stellar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <RouteAnnouncer />
        <main>{children}</main>
        <ThemeToggle />
      </body>
    </html>
  );
}