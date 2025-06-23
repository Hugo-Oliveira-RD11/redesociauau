"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGroups = exports.searchUsers = exports.updateUserProfilePicture = exports.getUserConnections = exports.unfollowUser = exports.followUser = exports.updateUserProfile = exports.getUserById = void 0;
const app_1 = require("../app");
// Função para buscar usuário por ID
const getUserById = async (userId) => {
    return await app_1.prisma.usuario.findUnique({
        where: { id_usuario: userId },
        select: {
            id_usuario: true,
            nome_usuario: true,
            email: true,
            foto_perfil: true,
            data_nascimento: true,
            biografia: true,
            tags: true,
            created_at: true
        }
    });
};
exports.getUserById = getUserById;
// Função para atualizar perfil do usuário
const updateUserProfile = async (userId, data) => {
    return await app_1.prisma.usuario.update({
        where: { id_usuario: userId },
        data: {
            nome_usuario: data.nome_usuario,
            biografia: data.biografia,
            data_nascimento: data.data_nascimento,
            tags: data.tags
        }
    });
};
exports.updateUserProfile = updateUserProfile;
// Função para seguir um usuário
const followUser = async (followerId, followedId) => {
    // Verifica se o usuário já está sendo seguido
    const existingFollow = await app_1.prisma.seguidor.findFirst({
        where: {
            id_seguidor: followerId,
            id_seguido: followedId
        }
    });
    if (existingFollow) {
        throw new Error('Você já segue este usuário');
    }
    return await app_1.prisma.seguidor.create({
        data: {
            id_seguidor: followerId,
            id_seguido: followedId
        }
    });
};
exports.followUser = followUser;
// Função para deixar de seguir um usuário
const unfollowUser = async (followerId, followedId) => {
    const follow = await app_1.prisma.seguidor.findFirst({
        where: {
            id_seguidor: followerId,
            id_seguido: followedId
        }
    });
    if (!follow) {
        throw new Error('Você não está seguindo este usuário');
    }
    return await app_1.prisma.seguidor.delete({
        where: {
            id_seguidor_id_seguido: {
                id_seguidor: followerId,
                id_seguido: followedId
            }
        }
    });
};
exports.unfollowUser = unfollowUser;
// ... (o restante do seu arquivo existente continua abaixo)
const getUserConnections = async (userId) => {
    const [following, followers] = await Promise.all([
        app_1.prisma.seguidor.findMany({
            where: { id_seguidor: userId },
            include: {
                seguido: {
                    select: {
                        id_usuario: true,
                        nome_usuario: true,
                        foto_perfil: true
                    }
                }
            }
        }),
        app_1.prisma.seguidor.findMany({
            where: { id_seguido: userId },
            include: {
                seguidor: {
                    select: {
                        id_usuario: true,
                        nome_usuario: true,
                        foto_perfil: true
                    }
                }
            }
        })
    ]);
    return { following, followers };
};
exports.getUserConnections = getUserConnections;
const updateUserProfilePicture = async (userId, imagePath) => {
    return app_1.prisma.usuario.update({
        where: { id_usuario: userId },
        data: { foto_perfil: imagePath }
    });
};
exports.updateUserProfilePicture = updateUserProfilePicture;
const searchUsers = async (query, page, limit) => {
    const skip = (page - 1) * limit;
    return app_1.prisma.usuario.findMany({
        skip,
        take: limit,
        where: {
            OR: [
                { nome_usuario: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
            ]
        },
        select: {
            id_usuario: true,
            nome_usuario: true,
            foto_perfil: true,
            tags: true
        }
    });
};
exports.searchUsers = searchUsers;
const getUserGroups = async (userId) => {
    return app_1.prisma.membroGrupo.findMany({
        where: { id_usuario: userId },
        include: {
            grupo: true
        }
    });
};
exports.getUserGroups = getUserGroups;
