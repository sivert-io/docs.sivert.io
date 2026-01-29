import type { Metadata } from 'next/types';
import { Page } from './source';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://docs.sivert.io',
      images: '/og/site/image.webp',
      siteName: 'docs.sivert.io',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sivert_io',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/og/site/image.webp',
      ...override.twitter,
    },
    alternates: {
      types: {
        'application/rss+xml': [
          {
            title: 'docs.sivert.io',
            url: 'https://docs.sivert.io',
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export function getPageImage(page: Page) {
  const segments = [...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development' || !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL('http://localhost:3000')
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
