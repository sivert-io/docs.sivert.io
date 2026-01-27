import type { Suggestion } from '@/components/not-found';
import { DataSourceId, orama } from '@/lib/orama/client';

export async function getSuggestions(pathname: string): Promise<Suggestion[]> {
  // Orama Cloud is optional; if not configured, suggestions are disabled.
  if (!orama || !DataSourceId) return [];

  const results = await orama.search({
    term: pathname,
    mode: 'vector',
    datasources: [DataSourceId],
    groupBy: {
      properties: ['url'],
      max_results: 1,
    },
  });

  if (!results?.groups) return [];

  return results.groups.flatMap((group) => {
    const doc = group.result[0];
    if (!doc) return [];

    return {
      id: doc.id,
      href: doc.document.url as string,
      title: doc.document.title as string,
    };
  });
}
