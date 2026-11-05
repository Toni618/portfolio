import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SceneLoader from "@/components/SceneLoader";
import ScrollProgress from "@/components/ScrollProgress";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.siteName, description: s.heroSubtitle };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Vazirmatn:wght@400;500;700&display=swap"
        />
      </head>
      <body className="antialiased">
        <ScrollProgress />

        <div className="fixed inset-0 -z-10">
          <SceneLoader />
        </div>

        <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" dir="auto" className="grad-text text-xl font-bold">
              {s.siteName}
            </Link>
            <div className="flex gap-4 text-xs text-white/80 md:gap-8 md:text-sm">
              <Link href="/#about" className="transition hover:text-neon-green">{s.navAbout}</Link>
              <Link href="/#skills" className="transition hover:text-neon-green">{s.navSkills}</Link>
              <Link href="/#projects" className="transition hover:text-neon-green">{s.navProjects}</Link>
              <Link href="/#contact" className="transition hover:text-neon-green">{s.navContact}</Link>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer dir="auto" className="py-10 text-center text-sm text-white/40">
          © {new Date().getFullYear()} {s.siteName} · {s.footerText}
        </footer>
      </body>
    </html>
  );
}
