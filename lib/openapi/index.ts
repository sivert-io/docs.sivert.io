import { createOpenAPI } from 'fumadocs-openapi/server';
import path from 'node:path';

export const openapi = createOpenAPI({
  input: [path.resolve('./openapi/mat/openapi.json')],
  proxyUrl: '/api/proxy',
});
