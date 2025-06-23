"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_URL = exports.ALLOWED_FILE_TYPES = exports.MAX_FILE_SIZE = exports.DATABASE_URL = exports.JWT_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
// Configurações básicas
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.PORT = parseInt(process.env.PORT || "3000", 10);
exports.JWT_SECRET = process.env.JWT_SECRET || "your-strong-secret-key-here";
exports.DATABASE_URL = process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5433/rededb?schema=public";
// Configurações de upload
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
// Validação das variáveis de ambiente
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];
if (exports.NODE_ENV === "production") {
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`❌ Missing required environment variable: ${envVar}`);
        }
    });
}
// Configuração do Redis para Socket.io (opcional)
exports.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
