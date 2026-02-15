import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { getSection } from '@/lib/source/navigation';

export const revalidate = false;

// Self-hosted search endpoint (used by `useDocsSearch({ type: "fetch" })`).
// This keeps search working even when Orama Cloud is not configured.
export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
  async buildIndex(page) {
    // `structuredData` exists for both MDX and OpenAPI sources but the exact type
    // differs between sources; treat it as `any` for indexing purposes.
    const loaded = (await page.data.load()) as { structuredData: any };

    return {
      title: page.data.title ?? page.url,
      description: page.data.description ?? '',
      url: page.url,
      id: page.url,
      structuredData: loaded.structuredData,
      // Use the top-level slug (mat/me/csm) for filtering in the UI.
      tag: page.slugs?.[0] ?? getSection(page.slugs?.[0]),
    };
  },
});

