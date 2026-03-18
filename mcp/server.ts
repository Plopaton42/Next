import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, basename, extname, join } from 'path';

// ---------------------------------------------------------------------------
// Resolve paths relative to the repo root (this file lives in mcp/)
// ---------------------------------------------------------------------------
const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const TOKENS_DIR = resolve(ROOT, 'tokens/source');
const COMPONENTS_DIR = resolve(ROOT, 'components');
const CLAUDE_MD = resolve(ROOT, 'CLAUDE.md');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readTokenFile(filePath: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function listAllTokens(): Record<string, Record<string, unknown>> {
  const result: Record<string, Record<string, unknown>> = {};
  if (!existsSync(TOKENS_DIR)) return result;

  function readDir(dir: string, prefix: string = '') {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
        readDir(fullPath, nextPrefix);
      } else if (entry.name.endsWith('.json')) {
        const name = basename(entry.name, extname(entry.name));
        const category = prefix ? `${prefix}/${name}` : name;
        const data = readTokenFile(fullPath);
        if (data) result[category] = data;
      }
    }
  }

  readDir(TOKENS_DIR);
  return result;
}

function getComponentFiles(name: string): {
  source: string | null;
  readme: string | null;
  error?: string;
} {
  const componentDir = resolve(COMPONENTS_DIR, name);
  if (!existsSync(componentDir)) {
    const entries = existsSync(COMPONENTS_DIR) ? readdirSync(COMPONENTS_DIR) : [];
    const match = entries.find((e) => e.toLowerCase() === name.toLowerCase());
    if (!match) {
      return {
        source: null,
        readme: null,
        error: `Component "${name}" not found. Available: ${entries.filter((e) => !e.startsWith('_')).join(', ') || 'none yet'}`,
      };
    }
    return getComponentFiles(match);
  }

  const vueFiles = readdirSync(componentDir).filter((f) => f.endsWith('.vue'));
  const source = vueFiles.length > 0
    ? readFileSync(resolve(componentDir, vueFiles[0]), 'utf-8')
    : null;

  const readmePath = resolve(componentDir, 'README.md');
  const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf-8') : null;

  return { source, readme };
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer({
  name: 'design-system',
  version: '0.1.0',
});

// Tool: list_tokens
server.tool(
  'list_tokens',
  'Returns all design tokens from tokens/source/ (recursively), organized by ' +
  'category path. Global tokens: "focus", "radius", "spacing", "typography", ' +
  '"shadows". Brand primitives: "primitives/norauto", "primitives/midas", etc. ' +
  'Semantic tokens: "semantic/norauto", "semantic/midas", etc. ' +
  'Uses W3C DTCG format with $value, $type, and $description fields.',
  {
    category: z
      .string()
      .optional()
      .describe(
        'Optional: filter to a single category path, e.g. "spacing" or ' +
        '"semantic/norauto" or "primitives/alert". Omit to return all.'
      ),
  },
  async ({ category }) => {
    const all = listAllTokens();
    const result = category ? { [category]: all[category] ?? null } : all;
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: get_component
server.tool(
  'get_component',
  'Returns the Vue SFC source code and README documentation for a named ' +
  'component in the design system. Component names are directory names ' +
  'inside components/, e.g. "Button", "Input", "_template".',
  {
    name: z
      .string()
      .min(1)
      .describe('Component directory name, e.g. "Button" or "_template"'),
  },
  async ({ name }) => {
    const { source, readme, error } = getComponentFiles(name);
    if (error) {
      return {
        content: [{ type: 'text', text: `Error: ${error}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              component: name,
              source: source ?? '(no .vue file found)',
              readme: readme ?? '(no README.md found)',
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool: get_conventions
server.tool(
  'get_conventions',
  'Returns the full CLAUDE.md file, which documents the design system name, ' +
  'purpose, token naming conventions, component conventions, how to add new ' +
  'components, and the complete token pipeline (Figma → JSON → CSS vars → Tailwind).',
  {},
  async () => {
    if (!existsSync(CLAUDE_MD)) {
      return {
        content: [{ type: 'text', text: 'Error: CLAUDE.md not found at repo root.' }],
        isError: true,
      };
    }
    return {
      content: [{ type: 'text', text: readFileSync(CLAUDE_MD, 'utf-8') }],
    };
  }
);

// ---------------------------------------------------------------------------
// Start server over stdio
// ---------------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
