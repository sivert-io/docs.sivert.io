FROM node:20-alpine AS deps
WORKDIR /app

# Enable yarn via Corepack (ships with Node)
RUN corepack enable

COPY package.json yarn.lock ./
# Install deps without running lifecycle scripts.
# `fumadocs-mdx` runs on postinstall and needs the repo files, which are copied in the build stage.
RUN yarn install --frozen-lockfile --ignore-scripts


FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache git

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run postinstall now that repo files exist (generates MDX artifacts).
RUN yarn run postinstall

# Build Next.js app
RUN yarn build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable

# Only copy the runtime bits
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]

