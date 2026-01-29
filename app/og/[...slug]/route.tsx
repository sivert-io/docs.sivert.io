import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generate as MetadataImage, getImageResponseOptions } from './generate';
import { ImageResponse } from '@takumi-rs/image-response';
import { getPageImage } from '@/lib/metadata';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params;
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);

  // Unified site-level OG image (used for default metadata).
  if (!page && pageSlug.length === 1 && pageSlug[0] === 'site') {
    return new ImageResponse(
      <MetadataImage
        title="docs.sivert.io"
        description="A unified documentation hub for sivert-io projects."
      />,
      await getImageResponseOptions(),
    );
  }

  if (!page) notFound();

  return new ImageResponse(
    <MetadataImage title={page.data.title} description={page.data.description} />,
    await getImageResponseOptions(),
  );
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
