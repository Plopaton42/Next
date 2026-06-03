# Stage 1: bundle TypeScript + all dependencies into a single JS file
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY mcp/ ./mcp/
COPY tokens/ ./tokens/
COPY style-dictionary.config.ts ./
RUN node_modules/.bin/esbuild mcp/server-http.ts \
    --bundle \
    --platform=node \
    --format=esm \
    --target=node22 \
    --outfile=dist-mcp/server.js \
    --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" \
    && node_modules/.bin/tsx style-dictionary.config.ts

# Stage 2: minimal runtime — only Node.js + bundle + data files, no node_modules
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist-mcp/server.js ./dist-mcp/server.js
COPY --from=builder /app/tokens/build/ ./tokens/build/
COPY tokens/source/ ./tokens/source/
COPY components/ ./components/
COPY CLAUDE.md ./CLAUDE.md

EXPOSE 8080
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Force port 3001 regardless of what Railway injects via PORT env var
CMD ["node", "-e", "process.env.PORT='3001'; import('./dist-mcp/server.js')"]
