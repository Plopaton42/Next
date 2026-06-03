# Stage 1: compile TypeScript → JavaScript
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY mcp/ ./mcp/
RUN node_modules/.bin/esbuild \
    mcp/server-http.ts \
    mcp/create-server.ts \
    --platform=node \
    --format=esm \
    --target=node22 \
    --outdir=dist-mcp

# Stage 2: lean runtime image (no devDeps, no tsx)
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist-mcp ./dist-mcp
COPY tokens/source/ ./tokens/source/
COPY components/ ./components/
COPY CLAUDE.md ./CLAUDE.md

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

CMD ["node", "dist-mcp/server-http.js"]
