import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, basename, extname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
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

  function readDir(dir: string, prefix = '') {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        readDir(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name);
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
  vue: string | null;
  react: string | null;
  types: string | null;
  readme: string | null;
  error?: string;
} {
  const componentDir = resolve(COMPONENTS_DIR, name);
  if (!existsSync(componentDir)) {
    const entries = existsSync(COMPONENTS_DIR) ? readdirSync(COMPONENTS_DIR) : [];
    const match = entries.find((e) => e.toLowerCase() === name.toLowerCase());
    if (!match) {
      return {
        vue: null,
        react: null,
        types: null,
        readme: null,
        error: `Component "${name}" not found. Available: ${
          entries.filter((e) => !e.startsWith('_')).join(', ') || 'none yet'
        }`,
      };
    }
    return getComponentFiles(match);
  }

  const files = readdirSync(componentDir);

  const vueFile = files.find((f) => f.endsWith('.vue'));
  const reactFile = files.find(
    (f) => f.endsWith('.tsx') && !f.includes('.stories') && !f.includes('.figma')
  );
  const typesFile = files.find((f) => f.endsWith('.types.ts'));
  const readmePath = resolve(componentDir, 'README.md');

  return {
    vue: vueFile ? readFileSync(resolve(componentDir, vueFile), 'utf-8') : null,
    react: reactFile ? readFileSync(resolve(componentDir, reactFile), 'utf-8') : null,
    types: typesFile ? readFileSync(resolve(componentDir, typesFile), 'utf-8') : null,
    readme: existsSync(readmePath) ? readFileSync(readmePath, 'utf-8') : null,
  };
}

// ---------------------------------------------------------------------------
// Server factory — shared by stdio and HTTP transports
// ---------------------------------------------------------------------------

export function createDesignSystemServer(): McpServer {
  const server = new McpServer({ name: 'design-system', version: '0.1.0' });

  // ------------------------------------------------------------------
  // list_components
  // ------------------------------------------------------------------
  server.tool(
    'list_components',
    'Lists all available components in the design system. ' +
    'Returns component names and which framework files are present ' +
    '(Vue, React, types, stories).',
    {},
    async () => {
      if (!existsSync(COMPONENTS_DIR)) {
        return { content: [{ type: 'text', text: '[]' }] };
      }
      const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
      const components = entries
        .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
        .map((e) => {
          const dir = resolve(COMPONENTS_DIR, e.name);
          const files = readdirSync(dir);
          return {
            name: e.name,
            hasVue: files.some((f) => f.endsWith('.vue')),
            hasReact: files.some(
              (f) => f.endsWith('.tsx') && !f.includes('.stories') && !f.includes('.figma')
            ),
            hasTypes: files.some((f) => f.endsWith('.types.ts')),
            hasVueStories: files.some((f) => f.endsWith('.stories.ts')),
            hasReactStories: files.some((f) => f.endsWith('.react.stories.tsx')),
          };
        });
      return {
        content: [{ type: 'text', text: JSON.stringify(components, null, 2) }],
      };
    }
  );

  // ------------------------------------------------------------------
  // list_tokens
  // ------------------------------------------------------------------
  server.tool(
    'list_tokens',
    'Returns all design tokens from tokens/source/ organized by category path. ' +
    'Global tokens: "focus", "radius", "spacing", "typography", "shadows". ' +
    'Brand primitives: "primitives/norauto", "primitives/midas", etc. ' +
    'Semantic tokens: "semantic/norauto", "semantic/midas", etc. ' +
    'Uses W3C DTCG format with $value, $type, and $description fields.',
    {
      category: z.string().optional().describe(
        'Filter to a single category path, e.g. "spacing" or "semantic/norauto". Omit for all.'
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

  // ------------------------------------------------------------------
  // get_component
  // ------------------------------------------------------------------
  server.tool(
    'get_component',
    'Returns the Vue SFC source, React TSX source, shared TypeScript types, ' +
    'and README documentation for a named component. ' +
    'Component names match directory names under components/, e.g. "Button", "Checkbox".',
    {
      name: z.string().min(1).describe('Component directory name, e.g. "Button" or "Checkbox"'),
    },
    async ({ name }) => {
      const { vue, react, types, readme, error } = getComponentFiles(name);
      if (error) {
        return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            component: name,
            vue: vue ?? '(no .vue file found)',
            react: react ?? '(no .tsx file found)',
            types: types ?? '(no .types.ts file found)',
            readme: readme ?? '(no README.md found)',
          }, null, 2),
        }],
      };
    }
  );

  // ------------------------------------------------------------------
  // get_conventions
  // ------------------------------------------------------------------
  server.tool(
    'get_conventions',
    'Returns the full CLAUDE.md conventions file: design system name and purpose, ' +
    'token naming, component structure, dual-framework (Vue + React) rules, ' +
    'and the complete Figma → JSON → CSS vars → Tailwind pipeline.',
    {},
    async () => {
      if (!existsSync(CLAUDE_MD)) {
        return {
          content: [{ type: 'text', text: 'Error: CLAUDE.md not found.' }],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: readFileSync(CLAUDE_MD, 'utf-8') }],
      };
    }
  );

  return server;
}
