import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createDesignSystemServer } from './create-server.js';

const server = createDesignSystemServer();
const transport = new StdioServerTransport();
await server.connect(transport);
