import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { getSection } from '@/lib/source/navigation';

export const revalidate = false;

// Self-hosted search endpoint (used by `useDocsSearch({ type: "fetch" })`).
// This keeps search working even when Orama Cloud is not configured.
const server = createFromSource(source, {
  language: 'english',
  async buildIndex(page) {
    // `structuredData` exists for both MDX and OpenAPI sources, but MDX uses a
    // lazy loader (`load()`), while OpenAPI pages expose data directly.
    const loaded = await (page.data as any).load?.();
    const structuredData = (page.data as any).structuredData ?? loaded?.structuredData ?? [];

    return {
      title: page.data.title ?? page.url,
      description: page.data.description ?? '',
      url: page.url,
      id: page.url,
      structuredData,
      // Use the top-level slug (mat/me/csm) for filtering in the UI.
      tag: page.slugs?.[0] ?? getSection(page.slugs?.[0]),
    };
  },
});

export const GET = server.GET;

