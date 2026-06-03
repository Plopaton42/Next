FROM node:22-alpine
WORKDIR /app

# Install all deps (tsx is in devDeps but required at runtime for the MCP server)
COPY package.json package-lock.json ./
RUN npm ci

# Copy only the files needed by the MCP HTTP server at runtime
COPY tsconfig.json ./tsconfig.json
COPY mcp/ ./mcp/
COPY tokens/source/ ./tokens/source/
COPY components/ ./components/
COPY CLAUDE.md ./CLAUDE.md

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
CMD ["npx", "tsx", "mcp/server-http.ts"]
