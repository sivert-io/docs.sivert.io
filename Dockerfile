FROM node:20-alpine AS deps
WORKDIR /app

# Enable yarn via Corepack (ships with Node)
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

