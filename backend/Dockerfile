FROM node:24.1-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci

RUN mkdir prisma
COPY schema.prisma prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:24.1-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/server.js"]
