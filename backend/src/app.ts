import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
// Rotas
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import groupRoutes from "./routes/group.routes";
import messageRoutes from "./routes/message.routes";
import commentRoutes from "./routes/comment.routes";
import tagRoutes from "./routes/tag.routes";
import notificationRoutes from "./routes/notification.routes";

// Middlewares
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";

// Configurações
import { NODE_ENV, PORT, JWT_SECRET, DATABASE_URL } from "./config";
import { initSocket } from "./services/notification.service";

// Inicialização do Express
const app = express();
const httpServer = createServer(app);

// Configuração do Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: NODE_ENV === "production" ? "https://seusite.com" : "*",
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutos
  },
});

// Inicialização do Prisma
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log:
    NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

// Middlewares Básicos
app.use(
  cors({
    origin: NODE_ENV === "production" ? "https://seusite.com" : "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true, limit: "10mb" }));

// Conexão com o Banco de Dados
const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// Configuração de Rotas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Servir arquivos estáticos
app.use("/uploads", express.static("uploads"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: "Connected",
  });
});

// Rota para teste do Socket.io
// app.get("/socket-test", authenticate, (req, res) => {
//   io.to(`user_${req.user.id_usuario}`).emit("test", {
//     message: "Teste de conexão",
//   });
//   res.json({ message: "Teste de socket enviado" });
// });

// Handler de erros
app.use(errorHandler);

// Inicialização do Socket.io
initSocket(io);

// Exportar a aplicação e servidor HTTP
export { httpServer as server, connectToDatabase };
