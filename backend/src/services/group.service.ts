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
    },
    include: {
      membros: true
    }
  });
};

export const joinGroup = async (groupId: number, userId: number) => {
  const existingMember = await prisma.membroGrupo.findUnique({
    where: {
      id_grupo_id_usuario: {
        id_grupo: groupId,
        id_usuario: userId
      }
    }
  });

  if (existingMember) {
    throw new Error('Você já é membro deste grupo');
  }

  const membership = await prisma.membroGrupo.create({
    data: {
      id_grupo: groupId,
      id_usuario: userId,
      funcao: 'MEMBER'
    },
    include: {
      grupo: true,
      usuario: true
    }
  });

  await notifyGroupAdmins(groupId, `${membership.usuario.nome_usuario} entrou no grupo`);

  return membership;
};

export const removeGroupMember = async (adminId: number, groupId: number, userId: number) => {
  await verifyAdminPermission(adminId, groupId);

  if (adminId === userId) {
    throw new Error('Transfira a administração antes de sair do grupo');
  }

  return prisma.membroGrupo.delete({
    where: {
      id_grupo_id_usuario: {
        id_grupo: groupId,
        id_usuario: userId
      }
    }
  });
};

export const deleteGroup = async (adminId: number, groupId: number) => {
  const group = await prisma.grupo.findUnique({
    where: { id_grupo: groupId },
    select: { criado_por: true }
  });

  if (!group || group.criado_por !== adminId) {
    throw new Error('Apenas o criador do grupo pode deletá-lo');
  }

  return prisma.grupo.delete({
    where: { id_grupo: groupId }
  });
};

const verifyAdminPermission = async (userId: number, groupId: number) => {
  const membership = await prisma.membroGrupo.findUnique({
    where: {
      id_grupo_id_usuario: {
        id_grupo: groupId,
        id_usuario: userId
      }
    },
    select: { funcao: true }
  });

  if (!membership || membership.funcao !== 'ADMIN') {
    throw new Error('Apenas o administrador pode realizar esta ação');
  }
};

const notifyGroupAdmins = async (groupId: number, message: string) => {
  const admins = await prisma.membroGrupo.findMany({
    where: {
      id_grupo: groupId,
      funcao: 'ADMIN'
    },
    select: { id_usuario: true }
  });

  await Promise.all(
    admins.map(admin =>
      sendNotification(admin.id_usuario, message, { type: 'group_update', groupId })
  );
);

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
