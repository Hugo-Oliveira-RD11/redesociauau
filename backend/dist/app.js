"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.server = exports.prisma = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const client_1 = require("@prisma/client");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Rotas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// Configurações
const config_1 = require("./config");
const notification_service_1 = require("./services/notification.service");
// Inicialização do Express
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.server = httpServer;
// Configuração do Socket.io
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: config_1.NODE_ENV === "production" ? "https://seusite.com" : "*",
        methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutos
    },
});
// Inicialização do Prisma
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: config_1.DATABASE_URL,
        },
    },
    log: config_1.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});
// Middlewares Básicos
app.use((0, cors_1.default)({
    origin: config_1.NODE_ENV === "production" ? "https://seusite.com" : "*",
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)(config_1.NODE_ENV === "production" ? "combined" : "dev"));
app.use((0, body_parser_1.json)({ limit: "10mb" }));
app.use((0, body_parser_1.urlencoded)({ extended: true, limit: "10mb" }));
// Conexão com o Banco de Dados
const connectToDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ Connected to database");
    }
    catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;
// Configuração de Rotas
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/posts", post_routes_1.default);
app.use("/api/v1/groups", group_routes_1.default);
app.use("/api/v1/messages", message_routes_1.default);
app.use("/api/v1/comments", comment_routes_1.default);
app.use("/api/v1/tags", tag_routes_1.default);
app.use("/api/v1/notifications", notification_routes_1.default);
// Servir arquivos estáticos
app.use("/uploads", express_1.default.static("uploads"));
// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: config_1.NODE_ENV,
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
app.use(error_middleware_1.errorHandler);
// Inicialização do Socket.io
(0, notification_service_1.initSocket)(exports.io);
