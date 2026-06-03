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

export function createDesignSystemServer(): McpServer {
  const server = new McpServer({ name: 'design-system', version: '0.1.0' });

  // ------------------------------------------------------------------
  // list_components
  // ------------------------------------------------------------------
  server.tool(
    'list_components',
    'Lists all available components in this design system. ' +
    'To use a component: call get_component to retrieve its source code, ' +
    'then copy the file directly into your project — no npm install needed. ' +
    'Also call get_token_styles to get the required CSS variables.',
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
          text: `# Available Components\n\n${list}\n\nCall \`get_component\` with a name to retrieve the source code and copy instructions.`,
        }],
      };
    }
  );

  // ------------------------------------------------------------------
  // get_component
  // ------------------------------------------------------------------
  server.tool(
    'get_component',
    'Retrieves a component\'s full source code with step-by-step instructions to add it to any project. ' +
    'Returns the React TSX file, Vue SFC file, TypeScript types, and README with props documentation. ' +
    'Copy the file into your project — no npm install needed. ' +
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
        '## How to add this component to your project',
        '',
        '### React',
        `1. Copy the React source below into \`src/components/${name}/${name}.tsx\``,
        `2. Import it: \`import { ${name} } from './components/${name}/${name}'\``,
        '',
        '### Vue',
        `1. Copy the Vue source below into \`src/components/${name}/${name}.vue\``,
        `2. Import it: \`import ${name} from './components/${name}/${name}.vue'\``,
        '',
        '> **Required:** The component uses CSS design tokens (`--ds-*` variables).',
        '> Call `get_token_styles` to get the CSS to add to your project.',
        '',
      ];

      if (types) {
        lines.push('## TypeScript Types', '', '```typescript', types, '```', '');
      }

      if (readme) {
        lines.push('## Documentation', '', readme, '');
      }

      if (react) {
        lines.push('## React Source', `*Copy to: \`src/components/${name}/${name}.tsx\`*`, '', '```tsx', react, '```', '');
      }

      if (vue) {
        lines.push('## Vue Source', `*Copy to: \`src/components/${name}/${name}.vue\`*`, '', '```vue', vue, '```', '');
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
