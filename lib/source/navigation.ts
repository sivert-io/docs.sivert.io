export function getSection(path: string | undefined) {
  if (!path) return 'framework';
  const [dir] = path.split('/', 1);
  if (!dir) return 'framework';

  // Sivert Docs projects → reuse upstream section theming
  // (these map to `.framework`, `.ui`, `.headless` classes in `app/global.css`).
  if (dir === 'mat') return 'framework';
  if (dir === 'me') return 'ui';
  if (dir === 'csm') return 'headless';

  return (
    {
      ui: 'ui',
      mdx: 'mdx',
      cli: 'cli',
      headless: 'headless',
    }[dir] ?? 'framework'
  );
}
