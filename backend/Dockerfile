# Etapa 1: Builder
FROM node:24.1-alpine AS builder

WORKDIR /app

# Instala dependências de build incluindo TypeScript
RUN apk add --no-cache python3 make g++

# Copia os arquivos de definição de dependências primeiro
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies como TypeScript)
RUN npm ci

# Copia os arquivos do Prisma
COPY prisma ./prisma

# Gera o Prisma Client
RUN npx prisma generate

# Copia todo o código fonte
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa 2: Runtime
FROM node:24.1-alpine

WORKDIR /app

# Instala dependências de runtime (apenas produção)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copia arquivos necessários do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
COPY --from=builder /app/prisma ./prisma

# Reexecuta generate para garantir compatibilidade
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/server.js"]
