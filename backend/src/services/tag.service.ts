import { prisma } from '../app';

export const addUserTag = async (userId: number, tagName: string) => {
  // Verificar se o usuário já tem 5 tags
  const tagCount = await prisma.usuarioTag.count({
    where: { id_usuario: userId }
  });

  if (tagCount >= 5) {
    throw new Error('Limite de tags atingido (máximo 5)');
  }

  // Criar ou conectar a tag
  const tag = await prisma.tag.upsert({
    where: { nome: tagName },
    create: { nome: tagName },
    update: {}
  });

  // Verificar se o usuário já tem essa tag
  const existingTag = await prisma.usuarioTag.findUnique({
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
  return prisma.usuarioTag.create({
    data: {
      id_usuario: userId,
      id_tag: tag.id_tag
    },
    include: {
      tag: true
    }
  });
};

export const removeUserTag = async (userId: number, tagId: number) => {
  return prisma.usuarioTag.delete({
    where: {
      id_usuario_id_tag: {
        id_usuario: userId,
        id_tag: tagId
      }
    }
  });
};

export const getUserTags = async (userId: number) => {
  return prisma.usuarioTag.findMany({
    where: { id_usuario: userId },
    include: { tag: true }
  });
};

export const searchByTags = async (tags: string[], page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return prisma.usuario.findMany({
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

export const getPopularTags = async (limit: number = 10) => {
  return prisma.$queryRaw`
    SELECT t.id_tag, t.nome, COUNT(ut.id_usuario) as user_count
    FROM tags t
    JOIN usuario_tags ut ON t.id_tag = ut.id_tag
    GROUP BY t.id_tag, t.nome
    ORDER BY user_count DESC
    LIMIT ${limit}
  `;
};
