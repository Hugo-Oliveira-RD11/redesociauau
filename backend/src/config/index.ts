import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Configurações básicas
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = parseInt(process.env.PORT || "3000", 10);
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-strong-secret-key-here";
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/rededb?schema=public";

// Configurações de upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// Validação das variáveis de ambiente
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];

if (NODE_ENV === "production") {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`❌ Missing required environment variable: ${envVar}`);
    }
  });
}

// Configuração do Redis para Socket.io (opcional)
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
