"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToComment = exports.getPostComments = exports.createComment = void 0;
const app_1 = require("../app");
const notification_service_1 = require("./notification.service");
const createComment = async (userId, postId, content, parentId) => {
    const comment = await app_1.prisma.comentario.create({
        data: {
            conteudo: content,
            id_postagem: postId,
            id_usuario: userId,
            id_comentario_pai: parentId
        },
        include: {
            autor: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            },
            postagem: {
                select: {
                    postado_por: true
                }
            }
        }
    });
    // Notificar o autor do post (se não for o próprio usuário)
    if (comment.postagem.postado_por !== userId) {
        await (0, notification_service_1.sendNotification)(comment.postagem.postado_por, `${comment.autor.nome_usuario} comentou na sua postagem`, { type: 'post_comment', postId, commentId: comment.id_comentario });
    }
    return comment;
};
exports.createComment = createComment;
const getPostComments = async (postId, page, limit) => {
    const skip = (page - 1) * limit;
    return app_1.prisma.comentario.findMany({
        skip,
        take: limit,
        where: { id_postagem: postId },
        orderBy: { data_criacao: 'desc' },
        include: {
            autor: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            },
            respostas: {
                include: {
                    autor: {
                        select: {
                            nome_usuario: true,
                            foto_perfil: true
                        }
                    }
                }
            }
        }
    });
};
exports.getPostComments = getPostComments;
const reactToComment = async (userId, commentId, reaction) => {
    return app_1.prisma.comentario.update({
        where: { id_comentario: commentId },
        data: {
            [reaction]: { increment: 1 }
        }
    });
};
exports.reactToComment = reactToComment;
