// NOTE: Upstream Fumadocs uses this route for MCP-based AI tooling.
// For Sivert Docs we keep the file (so future upstream syncs stay simple),
// but disable it by default to avoid build-time/runtime failures when the
// required services/env vars are not configured.
//
// If you later want this enabled, we can reintroduce the upstream handler
// behind an env flag and dynamic imports.

export async function GET() {
  return new Response('MCP transport is disabled.', { status: 404 });
}

export async function POST() {
  return new Response('MCP transport is disabled.', { status: 404 });
}

export async function DELETE() {
  return new Response('MCP transport is disabled.', { status: 404 });
}
