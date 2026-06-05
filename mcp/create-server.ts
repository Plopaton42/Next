import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, basename, extname, join } from 'path';

const ROOT = process.cwd();
const TOKENS_DIR = resolve(ROOT, 'tokens/source');
const TOKENS_BUILD_DIR = resolve(ROOT, 'tokens/build');
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

const SERVER_INSTRUCTIONS = `
You are connected to the @plopaton42/design-system MCP server.

## FIRST ACTION REQUIRED
Call the \`setup\` tool immediately. It returns the exact package.json dependency and CSS imports to add to the project. Do this before using any component.

## Available components
Button, Checkbox, SplitButton — call \`list_components\` for details.

## Available MCP tools
- \`setup\` — **call this first** — returns package.json patch + CSS imports required
- \`list_components\` — list all components with framework support
- \`get_component\` — get props, API docs and usage examples for a specific component
- \`get_token_styles\` — get the built CSS (--ds-* variables) ready to paste in global stylesheet
- \`list_tokens\` — get raw DTCG token JSON
- \`get_conventions\` — get the full design system conventions
`.trim();

export function createDesignSystemServer(): McpServer {
  const server = new McpServer({
    name: 'design-system',
    version: '0.1.0',
    instructions: SERVER_INSTRUCTIONS,
  });

  // ------------------------------------------------------------------
  // setup — must be called first
  // ------------------------------------------------------------------
  server.tool(
    'setup',
    'CALL THIS FIRST before using any component. ' +
    'Returns the exact package.json dependency to add and the CSS imports required. ' +
    'Add the dependency to package.json, run npm install, then add the CSS to the global stylesheet.',
    {},
    async () => {
      return {
        content: [{
          type: 'text',
          text: [
            '# Setup — @plopaton42/design-system',
            '',
            '## Step 1 — Add to package.json dependencies',
            '',
            'Add this entry to the `dependencies` field of the project\'s `package.json`:',
            '',
            '```json',
            '"@plopaton42/design-system": "latest"',
            '```',
            '',
            'Then run:',
            '```bash',
            'npm install',
            '```',
            '',
            '## Step 2 — Add CSS to global stylesheet',
            '',
            'Add these imports to the project\'s global CSS file (e.g. `src/index.css`, `src/globals.css`, or `src/styles.css`):',
            '',
            '```css',
            "@import '@plopaton42/design-system/tokens/variables.css';",
            "@import '@plopaton42/design-system/tokens/semantic.css';",
            "@import '@plopaton42/design-system/style.css';",
            '```',
            '',
            '## Step 3 — Import components',
            '',
            'React:',
            '```tsx',
            "import { Button, Checkbox, SplitButton } from '@plopaton42/design-system/react'",
            '```',
            '',
            'Vue:',
            '```vue',
            "import { Button, Checkbox, SplitButton } from '@plopaton42/design-system'",
            '```',
            '',
            '## Done',
            'Setup complete. Call `list_components` to see all available components.',
          ].join('\n'),
        }],
      };
    }
  );

  // ------------------------------------------------------------------
  // list_components
  // ------------------------------------------------------------------
  server.tool(
    'list_components',
    'Lists all available components in this design system. ' +
    'All components are available via the npm package @plopaton42/design-system. ' +
    'Install it first: npm install @plopaton42/design-system. ' +
    'Then import: import { Button } from "@plopaton42/design-system/react". ' +
    'Call get_component to get the props API and usage examples for a specific component.',
    {},
    async () => {
      if (!existsSync(COMPONENTS_DIR)) {
        return { content: [{ type: 'text', text: 'No components directory found.' }] };
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
          };
        });

      const list = components.map((c) =>
        `- **${c.name}** (${[c.hasReact && 'React', c.hasVue && 'Vue'].filter(Boolean).join(', ')})`
      ).join('\n');

      return {
        content: [{
          type: 'text',
          text: `# Available Components\n\nAll components are imported from \`@plopaton42/design-system/react\` (React) or \`@plopaton42/design-system\` (Vue).\nIf the package is not in package.json yet, call \`setup\` first.\n\n${list}\n\nCall \`get_component\` with a name for the full API and props documentation.`,
        }],
      };
    }
  );

  // ------------------------------------------------------------------
  // get_component
  // ------------------------------------------------------------------
  server.tool(
    'get_component',
    'Returns the full API documentation, props, and usage examples for a component. ' +
    'Components are used via the npm package — install it first: npm install @plopaton42/design-system. ' +
    'Import: import { Button } from "@plopaton42/design-system/react". ' +
    'Component names: "Button", "Checkbox", "SplitButton".',
    {
      name: z.string().min(1).describe('Component name, e.g. "Button", "Checkbox", "SplitButton"'),
    },
    async ({ name }) => {
      const { vue, react, types, readme, error } = getComponentFiles(name);
      if (error) {
        return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
      }

      const lines: string[] = [
        `# Component: ${name}`,
        '',
        '> Package not in package.json yet? Call `setup` first.',
        '',
        '## Import',
        '',
        '```tsx',
        `// React`,
        `import { ${name} } from '@plopaton42/design-system/react'`,
        '```',
        '```vue',
        `<!-- Vue -->`,
        `import { ${name} } from '@plopaton42/design-system'`,
        '```',
        '',
      ];

      if (readme) {
        lines.push('## API Documentation', '', readme, '');
      }

      if (types) {
        lines.push('## TypeScript Types', '', '```typescript', types, '```', '');
      }

      return { content: [{ type: 'text', text: lines.join('\n') }] };
    }
  );

  // ------------------------------------------------------------------
  // get_token_styles
  // ------------------------------------------------------------------
  server.tool(
    'get_token_styles',
    'Returns the CSS design tokens (custom properties) required for components to render correctly. ' +
    'Add this CSS to your project\'s global stylesheet. ' +
    'Contains all --ds-* CSS variables for colors, spacing, typography, shadows, and border-radius.',
    {},
    async () => {
      const variablesPath = resolve(TOKENS_BUILD_DIR, 'variables.css');
      const semanticPath = resolve(TOKENS_BUILD_DIR, 'semantic.css');

      const hasBuilt = existsSync(variablesPath) && existsSync(semanticPath);

      if (!hasBuilt) {
        return {
          content: [{
            type: 'text',
            text: [
              '# Design Token CSS',
              '',
              'The pre-built CSS files are not available in this environment.',
              'To generate them, run `npm run build:tokens` in the design system repo.',
              '',
              'Then add these two files to your project:',
              '- `tokens/build/variables.css` → primitive color/spacing/type tokens',
              '- `tokens/build/semantic.css` → semantic (purpose-based) tokens',
              '',
              'Or import them if using the npm package:',
              '```css',
              '@import "@plopaton42/design-system/tokens/variables.css";',
              '@import "@plopaton42/design-system/tokens/semantic.css";',
              '```',
            ].join('\n'),
          }],
          isError: false,
        };
      }

      const variables = readFileSync(variablesPath, 'utf-8');
      const semantic = readFileSync(semanticPath, 'utf-8');

      return {
        content: [{
          type: 'text',
          text: [
            '# Design Token CSS',
            '',
            'Add both CSS blocks to your project\'s global stylesheet (e.g. `src/index.css` or `src/globals.css`).',
            '',
            '## variables.css — Primitive tokens (colors, spacing, radius, typography)',
            '',
            '```css',
            variables,
            '```',
            '',
            '## semantic.css — Semantic tokens (button surfaces, text colors, etc.)',
            '',
            '```css',
            semantic,
            '```',
          ].join('\n'),
        }],
      };
    }
  );

  // ------------------------------------------------------------------
  // list_tokens
  // ------------------------------------------------------------------
  server.tool(
    'list_tokens',
    'Returns all design tokens as structured JSON from tokens/source/. ' +
    'Use get_token_styles instead if you need ready-to-use CSS for your project. ' +
    'This is useful for understanding available values before building custom components.',
    {
      category: z.string().optional().describe(
        'Filter by category, e.g. "spacing", "radius", "semantic/norauto". Omit for all.'
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
  // get_conventions
  // ------------------------------------------------------------------
  server.tool(
    'get_conventions',
    'Returns the full design system conventions: component architecture, token naming, ' +
    'dual-framework (Vue + React) rules, and the Figma → tokens → CSS pipeline.',
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
