"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const config_1 = require("./config");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const startServer = async () => {
    // Conectar ao banco de dados
    await (0, app_1.connectToDatabase)();
    // Iniciar o servidor
    app_1.server.listen(config_1.PORT, () => {
        console.log(`
      🚀 Server running in ${config_1.NODE_ENV} mode
      📡 Listening on port ${config_1.PORT}
      ⏰ ${new Date().toLocaleString()}
      🖥️  PID: ${process.pid}
    `);
    });
    // Tratamento de erros não capturados
    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err);
        process.exit(1);
    });
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
    });
};
// Modo Cluster para produção
if (config_1.NODE_ENV === 'production' && cluster_1.default.isPrimary) {
    const numCPUs = os_1.default.cpus().length;
    console.log(`🔄 Starting ${numCPUs} workers`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    startServer().catch(err => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });
}
