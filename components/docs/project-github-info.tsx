'use client';

import { GithubInfo } from 'fumadocs-ui/components/github-info';
import { usePathname } from 'next/navigation';

const projects = {
  matchzy: { owner: 'sivert-io', repo: 'matchzy-auto-tournament' },
  'matchzy-enhanced': { owner: 'sivert-io', repo: 'MatchZy-Enhanced' },
  'server-manager': { owner: 'sivert-io', repo: 'cs2-server-manager' },
} as const;

export function ProjectGithubInfo({ className }: { className?: string }) {
  const pathname = usePathname();
  const root = pathname.split('/')[2] ?? '';
  const info = (projects as Record<string, { owner: string; repo: string }>)[root];
  if (!info) return null;

  return <GithubInfo owner={info.owner} repo={info.repo} className={className} />;
}

