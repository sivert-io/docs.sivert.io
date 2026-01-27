import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { Github, MessageCircle } from 'lucide-react';

// Keep external links minimal; the docs tabs are the primary navigation.
export const linkItems: LinkItemType[] = [
  {
    type: 'icon',
    on: 'nav',
    label: 'Discord',
    icon: <MessageCircle className="size-4" />,
    text: 'Discord',
    url: 'https://discord.gg/n7gHYau7aW',
    external: true,
    active: 'none',
  },
  {
    type: 'icon',
    on: 'nav',
    label: 'GitHub (sivert-io)',
    icon: <Github className="size-4" />,
    text: 'GitHub',
    url: 'https://github.com/sivert-io',
    external: true,
    active: 'none',
  },
];

// Optional placeholder (docs layout will render a text title).
export const logo = null;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'docs.sivert.io',
    },
  };
}
