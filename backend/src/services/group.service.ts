import { prisma } from '../app';
import { sendNotification } from './notification.service';

export const createGroup = async (userId: number, name: string, description: string) => {
  return prisma.grupo.create({
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

export const addGroupMember = async (groupId: number, userId: number, role: string) => {
  const membership = await prisma.membroGrupo.create({
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
  await sendNotification(
    userId,
    `Você foi adicionado ao grupo ${membership.grupo.nome}`,
    { type: 'group_invite', groupId }
  );

  return membership;
};

export const removeGroupMember = async (groupId: number, userId: number) => {
  return prisma.membroGrupo.delete({
    where: {
      id_grupo_id_usuario: {
        id_grupo: groupId,
        id_usuario: userId
      }
    }
  });
};

export const getGroupPosts = async (groupId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return prisma.postagem.findMany({
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

export const searchGroups = async (query: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return prisma.grupo.findMany({
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
