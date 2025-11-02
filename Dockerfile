FROM node:20-slim as builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx prisma generate --schema db/schema.prisma
RUN npm run build

FROM node:20-slim as runner
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server
COPY --from=builder /app/db ./db

RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd openssl && rm -rf /var/lib/apt/lists/*
RUN npm i --omit=dev --ignore-scripts prisma@^6.16.3 @prisma/client@^6.16.3

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
