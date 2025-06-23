"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeed = exports.deletePost = exports.reactToPost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const app_1 = require("../app");
const notification_service_1 = require("./notification.service");
const createPost = async (postData) => {
    return await app_1.prisma.postagem.create({
        data: {
            conteudo: postData.conteudo,
            postado_por: postData.postado_por,
            tipo: postData.tipo || 'texto', // Valor padrão caso não seja fornecido
            id_grupo: postData.id_grupo || null,
            midia: postData.midia || null,
            upvote: 0,
            downvote: 0
        }
    });
};
exports.createPost = createPost;
const getPosts = async (options) => {
    const skip = options?.page && options?.limit
        ? (options.page - 1) * options.limit
        : 0;
    return await app_1.prisma.postagem.findMany({
        skip,
        take: options?.limit,
        where: {
            ...(options?.userId && { postado_por: options.userId }),
            ...(options?.groupId && { id_grupo: options.groupId })
        },
        orderBy: { data_criacao: 'desc' },
        include: {
            autor: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            },
            _count: {
                select: { comentarios: true }
            }
        }
    });
};
exports.getPosts = getPosts;
const getPostById = async (postId) => {
    return await app_1.prisma.postagem.findUnique({
        where: { id_postagem: postId },
        include: {
            autor: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            },
            comentarios: {
                orderBy: { data_criacao: 'desc' },
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
exports.getPostById = getPostById;
const reactToPost = async (userId, postId, reaction) => {
    const post = await app_1.prisma.postagem.update({
        where: { id_postagem: postId },
        data: {
            [reaction]: { increment: 1 }
        },
        include: {
            autor: {
                select: {
                    id_usuario: true
                }
            }
        }
    });
    // Notificar o autor do post (se não for o próprio usuário)
    if (post.autor.id_usuario !== userId) {
        await (0, notification_service_1.sendNotification)(post.autor.id_usuario, `Alguém reagiu à sua postagem`, { type: 'post_reaction', postId, reaction });
    }
    return post;
};
exports.reactToPost = reactToPost;
const deletePost = async (userId, postId) => {
    // Verificar se o usuário é o autor ou admin do grupo
    const post = await app_1.prisma.postagem.findUnique({
        where: { id_postagem: postId },
        include: {
            grupo: {
                include: {
                    membros: {
                        where: { id_usuario: userId }
                    }
                }
            }
        }
    });
    if (!post)
        throw new Error('Postagem não encontrada');
    const isAuthor = post.postado_por === userId;
    // const isGroupAdmin = post.grupo?.membros.some(m => m.funcao === 'ADMIN');
    const isGroupAdmin = post.grupo?.membros.some((m) => m.funcao === 'ADMIN');
    if (!isAuthor && !isGroupAdmin) {
        throw new Error('Não autorizado');
    }
    return app_1.prisma.postagem.delete({
        where: { id_postagem: postId }
    });
};
exports.deletePost = deletePost;
const getFeed = async (userId, page, limit) => {
    const skip = (page - 1) * limit;
    // Obter IDs dos usuários que o usuário atual segue
    const following = await app_1.prisma.seguidor.findMany({
        where: { id_seguidor: userId },
        select: { id_seguido: true }
    });
    // const followingIds = following.map(f => f.id_seguido);
    const followingIds = following.map((f) => f.id_seguido);
    return app_1.prisma.postagem.findMany({
        skip,
        take: limit,
        where: {
            OR: [
                { postado_por: { in: followingIds } },
                { id_grupo: null } // Postagens públicas
            ]
        },
        orderBy: { data_criacao: 'desc' },
        include: {
            autor: {
                select: {
                    nome_usuario: true,
                    foto_perfil: true
                }
            },
            _count: {
                select: { comentarios: true }
            }
        }
    });
};
exports.getFeed = getFeed;
