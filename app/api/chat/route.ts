// NOTE: Upstream Fumadocs uses this route for hosted AI chat.
// We disable it by default in Sivert Docs to keep builds/config simple.
// It can be re-enabled later behind an env flag.

export async function POST() {
  return new Response('AI chat is disabled.', { status: 404 });
}
