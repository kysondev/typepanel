#!/bin/sh
set -e

cd /app

echo "Waiting for database..."
until nc -z db 5432; do
  sleep 1
done
echo "Database ready!"

./node_modules/.bin/prisma migrate deploy --schema db/schema.prisma
./node_modules/.bin/prisma generate --schema db/schema.prisma

echo "Starting Next.js app..."
exec node server.js -H 0.0.0.0
