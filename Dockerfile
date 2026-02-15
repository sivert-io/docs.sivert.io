ARG GIT_COMMIT_SHA=unknown

FROM node:20-bookworm-slim AS deps
WORKDIR /app
ARG GIT_COMMIT_SHA

# Enable yarn via Corepack (ships with Node)
RUN corepack enable

COPY package.json yarn.lock ./
# Install deps without running lifecycle scripts.
# `fumadocs-mdx` runs on postinstall and needs the repo files, which are copied in the build stage.
RUN yarn install --frozen-lockfile --ignore-scripts


FROM node:20-bookworm-slim AS build
WORKDIR /app
ARG GIT_COMMIT_SHA
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run postinstall now that repo files exist (generates MDX artifacts).
RUN yarn run postinstall

# Build Next.js app
# Note: This project relies on Turbopack-only module schemes (e.g. `fumadocs-mdx:`),
# so we cannot use `next build --webpack`.
# The build can occasionally crash in container environments; retry a few times.
RUN set -e; \
  for i in 1 2 3; do \
    echo "Next build attempt $i/3"; \
    yarn build && exit 0; \
    echo "Build failed; retrying in 2s..."; \
    sleep 2; \
  done; \
  exit 1


FROM node:20-bookworm-slim AS runner
WORKDIR /app
ARG GIT_COMMIT_SHA
LABEL org.opencontainers.image.revision=$GIT_COMMIT_SHA
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_GIT_SHA=$GIT_COMMIT_SHA

RUN corepack enable

# Record the built git revision for deploy checks.
RUN echo "$GIT_COMMIT_SHA" > /app/BUILD_COMMIT

# Only copy the runtime bits
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/source.config.ts ./source.config.ts
COPY --from=build /app/source.script.ts ./source.script.ts
COPY --from=build /app/.source ./.source
COPY --from=build /app/openapi ./openapi
COPY --from=build /app/content ./content
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]

