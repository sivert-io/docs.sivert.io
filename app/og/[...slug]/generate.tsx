import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import type { ImageResponseOptions } from '@takumi-rs/image-response';

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
}

async function safeFont(
  filePath: string,
  opts: { name: string; weight: number },
): Promise<{ name: string; data: Buffer; weight: number } | null> {
  try {
    const data = await readFile(filePath);
    return { ...opts, data };
  } catch {
    // Fonts are optional; fall back to default fonts if missing.
    return null;
  }
}

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  const fonts = (
    await Promise.all([
      safeFont('./lib/og/JetBrainsMono-Regular.ttf', { name: 'Mono', weight: 400 }),
      safeFont('./lib/og/JetBrainsMono-Bold.ttf', { name: 'Mono', weight: 600 }),
    ])
  ).filter((f): f is NonNullable<typeof f> => f != null);

  return {
    width: 1200,
    height: 630,
    format: 'webp',
    fonts,
  };
}

export function generate({ title, description }: GenerateProps) {
  const siteName = 'docs.sivert.io';
  const primaryTextColor = 'rgb(240,240,240)';
  const logo = (
    <svg width="60" height="60" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="37" height="37" rx="7.5" fill="#151515" />
      <rect x="0.5" y="0.5" width="37" height="37" rx="7.5" stroke="#2A2A2A" />
      <path
        d="M17.4 21.128V22.4288C17.397 22.7029 17.3236 22.9716 17.1869 23.2092C17.0501 23.4468 16.8547 23.6453 16.6192 23.7856C16.1193 24.1559 15.7127 24.6376 15.4316 25.1925C15.1505 25.7475 15.0027 26.3603 15 26.9824M20.6 21.128V22.4288C20.603 22.7029 20.6764 22.9716 20.8131 23.2092C20.9499 23.4468 21.1453 23.6453 21.3808 23.7856C21.8807 24.1559 22.2873 24.6376 22.5684 25.1925C22.8495 25.7475 22.9973 26.3603 23 26.9824M23.8 16.6H25C25.5304 16.6 26.0391 16.3893 26.4142 16.0142C26.7893 15.6391 27 15.1304 27 14.6C27 14.0696 26.7893 13.5609 26.4142 13.1858C26.0391 12.8107 25.5304 12.6 25 12.6H23.8M23.8 16.6C23.8 17.873 23.2943 19.0939 22.3941 19.9941C21.4939 20.8943 20.273 21.4 19 21.4C17.727 21.4 16.5061 20.8943 15.6059 19.9941C14.7057 19.0939 14.2 17.873 14.2 16.6M23.8 16.6V11.8C23.8 11.5878 23.7157 11.3843 23.5657 11.2343C23.4157 11.0843 23.2122 11 23 11H15C14.7878 11 14.5843 11.0843 14.4343 11.2343C14.2843 11.3843 14.2 11.5878 14.2 11.8V16.6M12.6 27H25.4M14.2 16.6H13C12.4696 16.6 11.9609 16.3893 11.5858 16.0142C11.2107 15.6391 11 15.1304 11 14.6C11 14.0696 11.2107 13.5609 11.5858 13.1858C11.9609 12.8107 12.4696 12.6 13 12.6H14.2"
        stroke="#BEA3F8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter id="logo-shadow" x="-20" y="-20" width="78" height="78" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="rgba(190,163,248,0.55)" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: 'rgb(10,10,10)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: 'auto',
            color: primaryTextColor,
          }}
        >
          {logo}
          <span
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
      </div>
    </div>
  );
}
