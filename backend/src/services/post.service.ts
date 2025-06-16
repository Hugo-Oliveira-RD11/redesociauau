import { prisma } from '../app';
import { sendNotification } from './notification.service';

export const createPost = async (postData: {
  postado_por: number;       // ID do autor
  conteudo: string;          // Texto do post
  tipo?: string;             // Novo campo (tipo de postagem)
  id_grupo?: number | null;  // Opcional (se for post em grupo)
  midia?: string | null;     // Opcional (URL de imagem/vídeo)
}) => {
  return await prisma.postagem.create({
    data: {
      conteudo: postData.conteudo,
      postado_por: postData.postado_por,
      tipo: postData.tipo || '',
      id_grupo: postData.id_grupo || null,
      midia: postData.midia || null,
      upvote: 0,
      downvote: 0
    }
  });
};

export const getPosts = async (options?: {
  userId?: number;          // Filtrar por autor (opcional)
  groupId?: number;         // Filtrar por grupo (opcional)
  page?: number;            // Paginação (opcional)
  limit?: number;           // Limite por página (opcional)
}) => {
  const skip = options?.page && options?.limit
    ? (options.page - 1) * options.limit
    : 0;

  return await prisma.postagem.findMany({
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

export const getPostById = async (postId: number) => {
  return await prisma.postagem.findUnique({
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

export const reactToPost = async (userId: number, postId: number, reaction: 'upvote' | 'downvote') => {
  const post = await prisma.postagem.update({
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

  if (post.autor.id_usuario !== userId) {
    await sendNotification(
      post.autor.id_usuario,
      `Alguém reagiu à sua postagem`,
      { type: 'post_reaction', postId, reaction }
    );
  }

  return post;
};

export const deletePost = async (userId: number, postId: number) => {
  // Verificar se o usuário é o autor ou admin do grupo
  const post = await prisma.postagem.findUnique({
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

  if (!post) throw new Error('Postagem não encontrada');

  const isAuthor = post.postado_por === userId;
    const isGroupAdmin = post.grupo?.membros.some((m: { funcao: string }) => m.funcao === 'ADMIN');

  if (!isAuthor && !isGroupAdmin) {
    throw new Error('Não autorizado');
  }

  return prisma.postagem.delete({
    where: { id_postagem: postId }
  });
};

export const getFeed = async (userId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const following = await prisma.seguidor.findMany({
    where: { id_seguidor: userId },
    select: { id_seguido: true }
  });

  const followingIds = following.map((f: { id_seguido: number }) => f.id_seguido);

  return prisma.postagem.findMany({
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

export const updatePost = async (
  userId: number,
  postId: number,
  updateData: {
    conteudo?: string;
    tipo?: string;
    id_grupo?: number | null;
    midia?: string | null;
  }
) => {
  // 1. Verificar se o post existe e se o usuário tem permissão
  const existingPost = await prisma.postagem.findUnique({
    where: { id_postagem: postId },
    select: {
      postado_por: true,
      grupo: {
        include: {
          membros: {
            where: { id_usuario: userId }
          }
        }
      }
    }
  });

  if (!existingPost) {
    throw new Error('Postagem não encontrada');
  }

  // 2. Verificar permissões (autor ou admin do grupo)
  const isAuthor = existingPost.postado_por === userId;
  const isGroupAdmin = existingPost.grupo?.membros.some(
    (m: { funcao: string }) => m.funcao === 'ADMIN'
  );

  if (!isAuthor && !isGroupAdmin) {
    throw new Error('Não autorizado a editar esta postagem');
  }

  // 3. Atualizar o post
  return await prisma.postagem.update({
    where: { id_postagem: postId },
    data: {
      conteudo: updateData.conteudo,
      tipo: updateData.tipo,
      id_grupo: updateData.id_grupo,
      midia: updateData.midia,
      editado: true, // Marca que foi editado
      data_edicao: new Date() // Registra quando foi editado
    },
    include: {
      autor: {
        select: {
          nome_usuario: true,
          foto_perfil: true
        }
      }
    }
  });
};
