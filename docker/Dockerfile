# STAGE 1: install
FROM docker.io/node:lts-alpine AS base

WORKDIR /base

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# STAGE 2: build
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base/node_modules ./node_modules
COPY . .
RUN yarn build

# STAGE 3: app
FROM base AS app
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /build/build ./
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/.env ./.env

CMD ["node", "main.js"]
