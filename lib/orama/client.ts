import { OramaCloud } from '@orama/core';

export const DataSourceId = process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID ?? '';

export const isAdmin = process.env.ORAMA_PRIVATE_API_KEY !== undefined;

const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
const apiKey = process.env.ORAMA_PRIVATE_API_KEY ?? process.env.NEXT_PUBLIC_ORAMA_API_KEY;

// Orama Cloud is optional; when not configured, we fall back to a minimal
// in-app search experience (page tree quick actions only).
export const hasOrama = Boolean(projectId && apiKey);

export const orama = hasOrama ? new OramaCloud({ projectId: projectId!, apiKey: apiKey! }) : null;
