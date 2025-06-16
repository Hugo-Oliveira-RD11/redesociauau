import { prisma } from '../app';
import { sendNotification } from './notification.service';

export const getUserById = async (userId: number) => {
  return await prisma.usuario.findUnique({
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

export const updateUserProfile = async (userId: number, data: any) => {
  return await prisma.usuario.update({
    where: { id_usuario: userId },
    data: {
      nome_usuario: data.nome_usuario,
      biografia: data.biografia,
      data_nascimento: data.data_nascimento,
      tags: data.tags
    }
  });
};

export const followUser = async (followerId: number, followedId: number) => {
  const existingFollow = await prisma.seguidor.findFirst({
    where: {
      id_seguidor: followerId,
      id_seguido: followedId
    }
  });

  if (existingFollow) {
    throw new Error('Você já segue este usuário');
  }

  return await prisma.seguidor.create({
    data: {
      id_seguidor: followerId,
      id_seguido: followedId
    }
  });
};

export const unfollowUser = async (followerId: number, followedId: number) => {
  const follow = await prisma.seguidor.findFirst({
    where: {
      id_seguidor: followerId,
      id_seguido: followedId
    }
  });

  if (!follow) {
    throw new Error('Você não está seguindo este usuário');
  }

  return await prisma.seguidor.delete({
    where: {
      id_seguidor_id_seguido: {
        id_seguidor: followerId,
        id_seguido: followedId
      }
    }
  });
};

export const getUserConnections = async (userId: number) => {
  const [following, followers] = await Promise.all([
    prisma.seguidor.findMany({
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
    prisma.seguidor.findMany({
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

export const updateUserProfilePicture = async (userId: number, imagePath: string) => {
  return prisma.usuario.update({
    where: { id_usuario: userId },
    data: { foto_perfil: imagePath }
  });
};

export const searchUsers = async (query: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return prisma.usuario.findMany({
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

export const getUserGroups = async (userId: number) => {
  return prisma.membroGrupo.findMany({
    where: { id_usuario: userId },
    include: {
      grupo: true
    }
  });
};
