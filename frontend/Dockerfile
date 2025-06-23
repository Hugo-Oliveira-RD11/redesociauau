# === Stage 1: Build ===
FROM node:20.9.0 AS builder
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package.json package-lock.json* ./
RUN npm install

# Copia o restante do código e realiza o build
COPY . .
RUN npm run build

# === Stage 2: Produção ===
FROM node:20.9.0 AS runner
WORKDIR /app

# Define a variável de ambiente para produção
ENV NODE_ENV production

# Copia os arquivos necessários do estágio de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
