"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getUserNotifications = exports.sendNotification = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const app_1 = require("../app");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true
        }
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token ||
                socket.handshake.headers['authorization']?.split(' ')[1];
            if (!token)
                throw new Error('Token não fornecido');
            const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            const user = await app_1.prisma.usuario.findUnique({
                where: { id_usuario: decoded.userId },
                select: { id_usuario: true, nome_usuario: true }
            });
            if (!user)
                throw new Error('Usuário não encontrado');
            socket.data.user = user;
            next();
        }
        catch (error) {
            next(new Error('Falha na autenticação'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`Usuário conectado: ${socket.data.user.nome_usuario}`);
        // Entrar na sala do usuário
        socket.join(`user_${socket.data.user.id_usuario}`);
        socket.on('disconnect', () => {
            console.log(`Usuário desconectado: ${socket.data.user.nome_usuario}`);
        });
    });
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io não inicializado');
    return io;
};
exports.getIO = getIO;
const sendNotification = async (userId, message, data) => {
    const io = (0, exports.getIO)();
    // Enviar via Socket.io se o usuário estiver online
    io.to(`user_${userId}`).emit('notification', { message, data });
    // Armazenar no banco de dados para histórico
    await app_1.prisma.notificacao.create({
        data: {
            id_usuario: userId,
            mensagem: message,
            tipo: data.type || 'generic',
            dados: JSON.stringify(data),
            lida: false,
            data_criacao: new Date()
        }
    });
};
exports.sendNotification = sendNotification;
const getUserNotifications = async (userId, limit = 20) => {
    return app_1.prisma.notificacao.findMany({
        where: { id_usuario: userId },
        orderBy: { data_criacao: 'desc' },
        take: limit
    });
};
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = async (notificationId) => {
    return app_1.prisma.notificacao.update({
        where: { id_notificacao: notificationId },
        data: { lida: true }
    });
};
exports.markNotificationAsRead = markNotificationAsRead;
