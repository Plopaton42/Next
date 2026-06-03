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

# PORT is injected by Railway (or defaults to 3001 in the server code)
# HOST defaults to 0.0.0.0 in the server code
CMD ["npx", "tsx", "mcp/server-http.ts"]
