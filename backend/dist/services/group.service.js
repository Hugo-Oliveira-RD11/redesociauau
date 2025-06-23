"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGroups = exports.getGroupPosts = exports.removeGroupMember = exports.addGroupMember = exports.createGroup = void 0;
const app_1 = require("../app");
const notification_service_1 = require("./notification.service");
const createGroup = async (userId, name, description) => {
    return app_1.prisma.grupo.create({
        data: {
            nome: name,
            descricao: description,
            criado_por: userId,
            membros: {
                create: {
                    id_usuario: userId,
                    funcao: 'ADMIN'
                }
            }
        }
    });
};
exports.createGroup = createGroup;
const addGroupMember = async (groupId, userId, role) => {
    const membership = await app_1.prisma.membroGrupo.create({
        data: {
            id_grupo: groupId,
            id_usuario: userId,
            funcao: role
        },
        include: {
            grupo: true,
            usuario: true
        }
    });
    // Notificar o usuário
    await (0, notification_service_1.sendNotification)(userId, `Você foi adicionado ao grupo ${membership.grupo.nome}`, { type: 'group_invite', groupId });
    return membership;
};
exports.addGroupMember = addGroupMember;
const removeGroupMember = async (groupId, userId) => {
    return app_1.prisma.membroGrupo.delete({
        where: {
            id_grupo_id_usuario: {
                id_grupo: groupId,
                id_usuario: userId
            }
        }
    });
};
exports.removeGroupMember = removeGroupMember;
const getGroupPosts = async (groupId, page, limit) => {
    const skip = (page - 1) * limit;
    return app_1.prisma.postagem.findMany({
        skip,
        take: limit,
        where: { id_grupo: groupId },
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
exports.getGroupPosts = getGroupPosts;
const searchGroups = async (query, page, limit) => {
    const skip = (page - 1) * limit;
    return app_1.prisma.grupo.findMany({
        skip,
        take: limit,
        where: {
            OR: [
                { nome: { contains: query, mode: 'insensitive' } },
                { descricao: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            _count: {
                select: { membros: true }
            }
        }
    });
};
exports.searchGroups = searchGroups;
