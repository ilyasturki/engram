# Build stage
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1 AS production
WORKDIR /app

# Create non-root user for security
RUN groupadd -r engram && useradd -r -g engram engram

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app

# Create library and metadata directories with proper permissions
RUN mkdir -p /app/library /app/metadata && chown -R engram:engram /app
# Switch to non-root user
USER engram

ENV NUXT_LIBRARY_PATH=/app/library
ENV NUXT_METADATA_PATH=/app/metadata

# Start the application
EXPOSE 3000/tcp
CMD ["bun", "run", "/app/server/index.mjs"]
