import Link from 'next/link';
import { Boxes, Plug, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="px-6 py-10 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">docs.sivert.io</h1>
        <p className="text-base sm:text-lg text-fd-muted-foreground mb-8">
          A unified documentation hub for my projects (CS2 tournament stack and more).
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
          >
            Browse docs
          </Link>
          <Link
            href="/docs/matchzy/quick-start"
            className="inline-flex items-center justify-center rounded-md border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent transition-colors"
          >
            Quick start: MAT
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <Link
            href="/docs/matchzy"
            className="rounded-lg border border-fd-border bg-fd-card p-5 hover:bg-fd-accent transition-colors"
          >
            <div className="w-full h-28 rounded-md border border-fd-border mb-4 flex items-center justify-center">
              <img
                src="/docs-assets/matchzy/icon.svg"
                alt="MAT icon"
                className="h-12 w-12"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="size-5" style={{ color: 'var(--framework-color)' }} />
              <div className="font-semibold">MAT (MatchZy Auto Tournament)</div>
            </div>
            <div className="text-sm text-fd-muted-foreground">
              Automated CS2 tournament management — bracket creation to final scores.
            </div>
          </Link>

          <Link
            href="/docs/matchzy-enhanced"
            className="rounded-lg border border-fd-border bg-fd-card p-5 hover:bg-fd-accent transition-colors"
          >
            <div className="w-full h-28 rounded-md border border-fd-border mb-4 flex items-center justify-center">
              <img
                src="/docs-assets/matchzy-enhanced/icon.svg"
                alt="ME icon"
                className="h-12 w-12"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Plug className="size-5" style={{ color: 'var(--ui-color)' }} />
              <div className="font-semibold">ME (MatchZy Enhanced)</div>
            </div>
            <div className="text-sm text-fd-muted-foreground">
              Enhanced MatchZy fork for tournament automation and integrations.
            </div>
          </Link>

          <Link
            href="/docs/server-manager"
            className="rounded-lg border border-fd-border bg-fd-card p-5 hover:bg-fd-accent transition-colors"
          >
            <div className="w-full h-28 rounded-md border border-fd-border mb-4 flex items-center justify-center">
              <img
                src="/docs-assets/server-manager/icon.svg"
                alt="CSM icon"
                className="h-12 w-12"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Boxes className="size-5" style={{ color: 'var(--headless-color)' }} />
              <div className="font-semibold">CSM (CS2 Server Manager)</div>
            </div>
            <div className="text-sm text-fd-muted-foreground">
              Deploy multiple dedicated CS2 servers with plugins and auto-updates.
            </div>
          </Link>
        </div>

        <p className="text-xs text-fd-muted-foreground mt-8">
          More projects will be added here over time.
        </p>
      </div>
    </main>
  );
}

