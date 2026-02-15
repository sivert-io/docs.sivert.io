import type { ReactNode } from 'react';
import fs from 'node:fs/promises';
import type { ImageResponseOptions } from 'next/server';

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
}

async function safeRead(filePath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(filePath);
  } catch {
    // Fonts are optional; fall back to default fonts if missing.
    return null;
  }
}

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  const [regular, bold] = await Promise.all([
    safeRead('./lib/og/JetBrainsMono-Regular.ttf'),
    safeRead('./lib/og/JetBrainsMono-Bold.ttf'),
  ]);

  const fonts: ImageResponseOptions['fonts'] = [];
  if (regular) fonts.push({ name: 'Mono', data: regular, weight: 400 });
  if (bold) fonts.push({ name: 'Mono', data: bold, weight: 600 });

  return {
    width: 1200,
    height: 630,
    fonts,
  };
}

export function generate({ title, description, logo, site = 'My App' }: GenerateProps) {
  const primaryTextColor = 'rgb(240,240,240)';

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
        <p
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </p>
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
          <p
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {site}
          </p>
        </div>
      </div>
    </div>
  );
}
