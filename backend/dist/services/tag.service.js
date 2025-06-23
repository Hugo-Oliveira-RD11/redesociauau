"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularTags = exports.searchByTags = exports.getUserTags = exports.removeUserTag = exports.addUserTag = void 0;
const app_1 = require("../app");
const addUserTag = async (userId, tagName) => {
    // Verificar se o usuário já tem 5 tags
    const tagCount = await app_1.prisma.usuarioTag.count({
        where: { id_usuario: userId }
    });
    if (tagCount >= 5) {
        throw new Error('Limite de tags atingido (máximo 5)');
    }
    // Criar ou conectar a tag
    const tag = await app_1.prisma.tag.upsert({
        where: { nome: tagName },
        create: { nome: tagName },
        update: {}
    });
    // Verificar se o usuário já tem essa tag
    const existingTag = await app_1.prisma.usuarioTag.findUnique({
        where: {
            id_usuario_id_tag: {
                id_usuario: userId,
                id_tag: tag.id_tag
            }
        }
    });
    if (existingTag) {
        throw new Error('Você já possui esta tag');
    }
    // Adicionar tag ao usuário
    return app_1.prisma.usuarioTag.create({
        data: {
            id_usuario: userId,
            id_tag: tag.id_tag
        },
        include: {
            tag: true
        }
    });
};
exports.addUserTag = addUserTag;
const removeUserTag = async (userId, tagId) => {
    return app_1.prisma.usuarioTag.delete({
        where: {
            id_usuario_id_tag: {
                id_usuario: userId,
                id_tag: tagId
            }
        }
    });
};
exports.removeUserTag = removeUserTag;
const getUserTags = async (userId) => {
    return app_1.prisma.usuarioTag.findMany({
        where: { id_usuario: userId },
        include: { tag: true }
    });
};
exports.getUserTags = getUserTags;
const searchByTags = async (tags, page, limit) => {
    const skip = (page - 1) * limit;
    return app_1.prisma.usuario.findMany({
        skip,
        take: limit,
        where: {
            tags: {
                some: {
                    tag: {
                        nome: { in: tags }
                    }
                }
            }
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
};
exports.searchByTags = searchByTags;
const getPopularTags = async (limit = 10) => {
    return app_1.prisma.$queryRaw `
    SELECT t.id_tag, t.nome, COUNT(ut.id_usuario) as user_count
    FROM tags t
    JOIN usuario_tags ut ON t.id_tag = ut.id_tag
    GROUP BY t.id_tag, t.nome
    ORDER BY user_count DESC
    LIMIT ${limit}
  `;
};
exports.getPopularTags = getPopularTags;
