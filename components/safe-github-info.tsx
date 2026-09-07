import { GithubInfo } from 'fumadocs-ui/components/github-info';

/**
 * `GithubInfo`, but a failed GitHub request cannot take the build down.
 *
 * `GithubInfo` fetches repository data while rendering, and it is rendered on
 * every MAT, ME and CSM page. During `next build` those renders are prerenders,
 * so one failed request aborts the whole export — the page cannot be built, and
 * Next stops.
 *
 * That is not hypothetical. Unauthenticated GitHub requests are capped at 60 an
 * hour per IP, and the deploy cron retries every five minutes, so each attempt
 * spent quota the next attempt needed. Every build failed on
 * "API rate limit exceeded", the running container was never replaced, and the
 * site quietly served a seven-month-old build while looking perfectly healthy.
 *
 * So: ask GitHub first, and skip the badge if the answer is not usable. Losing
 * a stars-and-forks badge is a much smaller problem than a docs site that
 * cannot deploy. Setting `GITHUB_TOKEN` raises the limit to 5000 an hour and
 * keeps the badge, but nothing depends on it being set.
 */
export async function SafeGithubInfo({
  owner,
  repo,
  className,
}: {
  owner: string;
  repo: string;
  className?: string;
}) {
  const headers = new Headers({ Accept: 'application/vnd.github+json' });
  if (process.env.GITHUB_TOKEN) {
    headers.set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`);
  }

  try {
    // Same URL GithubInfo uses, so this is the request it would have made
    // rather than an extra one against the same quota.
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      console.warn(
        `[docs] GitHub returned ${response.status} for ${owner}/${repo}. ` +
          'Building without the repository badge. Set GITHUB_TOKEN to raise the rate limit.',
      );
      return null;
    }
  } catch (error) {
    console.warn(
      `[docs] Could not reach the GitHub API for ${owner}/${repo}. ` +
        'Building without the repository badge.',
      error,
    );
    return null;
  }

  return <GithubInfo owner={owner} repo={repo} className={className} />;
}
