import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { getSection } from '@/lib/source/navigation';

export const revalidate = false;

// Self-hosted search endpoint (used by `useDocsSearch({ type: "fetch" })`).
// This keeps search working even when Orama Cloud is not configured.
export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
  buildIndex(page) {
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      // Use the top-level slug (mat/me/csm) for filtering in the UI.
      tag: page.slugs?.[0] ?? getSection(page.slugs?.[0]),
    };
  },
});

