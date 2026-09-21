import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  // Reduce build-time parallelism to avoid occasional worker crashes in
  // containerized builds when statically generating many pages.
  experimental: {
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 100000,
    staticGenerationRetryCount: 2,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  // The CS2 plugin (formerly MatchZy Enhanced) and CS2 Server Manager docs moved
  // to docs.autotournament.gg. Old links land on the matching new page; anything
  // not listed falls back to the section's start page.
  async redirects() {
    return [
      { source: '/docs/me', destination: 'https://docs.autotournament.gg/cs2/plugin', permanent: true },
      { source: '/docs/me/user', destination: 'https://docs.autotournament.gg/cs2/plugin', permanent: true },
      { source: '/docs/me/quick-start', destination: 'https://docs.autotournament.gg/cs2/plugin/install', permanent: true },
      { source: '/docs/me/user/installation', destination: 'https://docs.autotournament.gg/cs2/plugin/install', permanent: true },
      { source: '/docs/me/user/configuration', destination: 'https://docs.autotournament.gg/cs2/plugin/configuration', permanent: true },
      { source: '/docs/me/user/convars', destination: 'https://docs.autotournament.gg/cs2/plugin/configuration', permanent: true },
      { source: '/docs/me/user/config-files', destination: 'https://docs.autotournament.gg/cs2/plugin/configuration', permanent: true },
      { source: '/docs/me/user/examples', destination: 'https://docs.autotournament.gg/cs2/plugin/configuration#examples', permanent: true },
      { source: '/docs/me/user/commands', destination: 'https://docs.autotournament.gg/cs2/plugin/commands', permanent: true },
      { source: '/docs/me/user/maps', destination: 'https://docs.autotournament.gg/cs2/plugin/match-config#maps', permanent: true },
      { source: '/docs/me/user/integration-endpoints', destination: 'https://docs.autotournament.gg/cs2/plugin/events', permanent: true },
      { source: '/docs/me/advanced', destination: 'https://docs.autotournament.gg/cs2/plugin/events', permanent: true },
      { source: '/docs/me/advanced/integration', destination: 'https://docs.autotournament.gg/cs2/plugin/events', permanent: true },
      { source: '/docs/me/advanced/center-notifications', destination: 'https://docs.autotournament.gg/cs2/plugin/configuration#chat-and-screen-messages', permanent: true },
      { source: '/docs/me/advanced/llm-quick-reference', destination: 'https://docs.autotournament.gg/cs2/plugin/match-config', permanent: true },
      { source: '/docs/me/advanced/changelog', destination: 'https://github.com/Auto-Tournament/cs2-plugin/releases', permanent: true },
      { source: '/docs/me/developer', destination: 'https://docs.autotournament.gg/cs2/plugin/building', permanent: true },
      { source: '/docs/me/developer/contributing', destination: 'https://docs.autotournament.gg/cs2/plugin/building', permanent: true },
      { source: '/docs/me/developer/from-source', destination: 'https://docs.autotournament.gg/cs2/plugin/building', permanent: true },
      { source: '/docs/csm', destination: 'https://docs.autotournament.gg/cs2/server-manager', permanent: true },
      { source: '/docs/csm/user', destination: 'https://docs.autotournament.gg/cs2/server-manager', permanent: true },
      { source: '/docs/csm/user/related-projects', destination: 'https://docs.autotournament.gg/cs2/server-manager', permanent: true },
      { source: '/docs/csm/quick-start', destination: 'https://docs.autotournament.gg/cs2/server-manager/install', permanent: true },
      { source: '/docs/csm/user/server-setup', destination: 'https://docs.autotournament.gg/cs2/server-manager/install', permanent: true },
      { source: '/docs/csm/user/managing-servers', destination: 'https://docs.autotournament.gg/cs2/server-manager/managing-servers', permanent: true },
      { source: '/docs/csm/user/configuration', destination: 'https://docs.autotournament.gg/cs2/server-manager/configuration', permanent: true },
      { source: '/docs/csm/user/auto-updates', destination: 'https://docs.autotournament.gg/cs2/server-manager/updates', permanent: true },
      { source: '/docs/csm/advanced/auto-updates-internals', destination: 'https://docs.autotournament.gg/cs2/server-manager/updates#how-the-monitor-works', permanent: true },
      { source: '/docs/csm/user/troubleshooting', destination: 'https://docs.autotournament.gg/cs2/server-manager/troubleshooting', permanent: true },
      { source: '/docs/csm/advanced/logging-system', destination: 'https://docs.autotournament.gg/cs2/server-manager/troubleshooting#logs', permanent: true },
      { source: '/docs/csm/advanced', destination: 'https://docs.autotournament.gg/cs2/server-manager/commands', permanent: true },
      { source: '/docs/csm/advanced/changelog', destination: 'https://github.com/Auto-Tournament/cs2-server-manager/releases', permanent: true },
      { source: '/docs/csm/developer', destination: 'https://docs.autotournament.gg/cs2/server-manager/building', permanent: true },
      { source: '/docs/csm/developer/contributing', destination: 'https://docs.autotournament.gg/cs2/server-manager/building', permanent: true },
      { source: '/docs/csm/developer/from-source', destination: 'https://docs.autotournament.gg/cs2/server-manager/building', permanent: true },
      { source: '/docs/me/:path*', destination: 'https://docs.autotournament.gg/cs2/plugin', permanent: true },
      { source: '/docs/csm/:path*', destination: 'https://docs.autotournament.gg/cs2/server-manager', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
      {
        source: '/docs.mdx',
        destination: '/llms.mdx',
      },
    ];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
