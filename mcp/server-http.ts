import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createDesignSystemServer } from './create-server.js';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';

// ---------------------------------------------------------------------------
// SSE — legacy, one transport per connection
// ---------------------------------------------------------------------------
const sseSessions = new Map<string, SSEServerTransport>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Mcp-Session-Id');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    // Health / discovery
    if (url.pathname === '/' && req.method === 'GET') {
      const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim() ?? 'http';
      const host = req.headers.host ?? `localhost:${PORT}`;
      const base = `${proto}://${host}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          {
            name: 'design-system',
            version: '0.1.0',
            endpoints: {
              mcp: `${base}/mcp`,
              sse: `${base}/sse`,
            },
            tools: ['list_components', 'get_component', 'get_token_styles', 'list_tokens', 'get_conventions'],
          },
          null,
          2
        )
      );
      return;
    }

    // /mcp — Streamable HTTP transport (stateless: new transport per POST)
    if (url.pathname === '/mcp') {
      if (req.method === 'POST') {
        const rawBody = await readBody(req);
        const parsedBody = rawBody ? JSON.parse(rawBody) : undefined;
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        const mcpServer = createDesignSystemServer();
        await mcpServer.connect(transport);
        res.on('close', () => { transport.close(); mcpServer.close(); });
        await transport.handleRequest(req, res, parsedBody);
      } else {
        res.writeHead(405, { Allow: 'POST' });
        res.end();
      }
      return;
    }

    // /sse — legacy SSE transport (GET opens stream)
    if (url.pathname === '/sse' && req.method === 'GET') {
      const sseTransport = new SSEServerTransport('/message', res);
      sseSessions.set(sseTransport.sessionId, sseTransport);
      res.on('close', () => sseSessions.delete(sseTransport.sessionId));
      const sseServer = createDesignSystemServer();
      await sseServer.connect(sseTransport);
      return;
    }

    // /message — legacy SSE transport (POST sends messages)
    if (url.pathname === '/message' && req.method === 'POST') {
      const sessionId = url.searchParams.get('sessionId') ?? '';
      const sseTransport = sseSessions.get(sessionId);
      if (!sseTransport) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Session not found', sessionId }));
        return;
      }
      await sseTransport.handlePostMessage(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found', path: url.pathname }));
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(err) }));
    }
  }
});

const shutdown = () => httpServer.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

httpServer.listen(PORT, HOST, () => {
  console.log(`Design System MCP server`);
  console.log(`  URL:            http://localhost:${PORT}`);
  console.log(`  MCP endpoint:   http://localhost:${PORT}/mcp   (Streamable HTTP)`);
  console.log(`  SSE endpoint:   http://localhost:${PORT}/sse   (legacy)`);
  console.log(`  Tools: list_tokens, list_components, get_component, get_conventions`);
});
