import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /api/mcp-server-script
 *
 * Serves the mcp-server.mjs file as a downloadable text response.
 * Used by McpModal's "Download Both Files" button so users get the
 * actual MCP server script alongside their vault.json.
 */
export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'mcp-server.mjs');

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const code = fs.readFileSync(scriptPath, 'utf-8');

    return new NextResponse(code, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Content-Disposition': 'attachment; filename="mcp-server.mjs"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[API] /api/mcp-server-script error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
