"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserConversations = exports.getConversation = exports.sendPrivateMessage = void 0;
const app_1 = require("../app");
const notification_service_1 = require("./notification.service");
const sendPrivateMessage = async (senderId, recipientId, content) => {
    const message = await app_1.prisma.mensagem.create({
        data: {
            conteudo: content,
            enviado_por: senderId,
            recebido_por: recipientId,
            status: 'enviada'
        },
        include: {
            remetente: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            }
        }
    });
    // Enviar notificação em tempo real
    await (0, notification_service_1.sendNotification)(recipientId, `Nova mensagem de ${message.remetente.nome_usuario}`, { type: 'message', messageId: message.id_mensagem });
    return message;
};
exports.sendPrivateMessage = sendPrivateMessage;
const getConversation = async (userId1, userId2, page, limit) => {
    const skip = (page - 1) * limit;
    const messages = await app_1.prisma.mensagem.findMany({
        skip,
        take: limit,
        where: {
            OR: [
                { enviado_por: userId1, recebido_por: userId2 },
                { enviado_por: userId2, recebido_por: userId1 }
            ]
        },
        orderBy: { data_envio: 'desc' },
        include: {
            remetente: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            }
        }
    });
    // Marcar mensagens como lidas
    await app_1.prisma.mensagem.updateMany({
        where: {
            enviado_por: userId2,
            recebido_por: userId1,
            status: 'enviada'
        },
        data: { status: 'lida' }
    });
    return messages;
};
exports.getConversation = getConversation;
const getUserConversations = async (userId) => {
    return app_1.prisma.$queryRaw `
    SELECT u.id_usuario, u.nome_usuario, u.foto_perfil, MAX(m.data_envio) as ultima_mensagem
    FROM mensagens m
    JOIN usuarios u ON (
      (m.enviado_por = u.id_usuario AND m.recebido_por = ${userId}) OR
      (m.recebido_por = u.id_usuario AND m.enviado_por = ${userId})
    )
    WHERE u.id_usuario != ${userId}
    GROUP BY u.id_usuario, u.nome_usuario, u.foto_perfil
    ORDER BY ultima_mensagem DESC
  `;
};
exports.getUserConversations = getUserConversations;
