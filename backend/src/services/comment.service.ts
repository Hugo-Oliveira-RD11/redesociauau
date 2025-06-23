import { prisma } from '../app';
import { sendNotification } from './notification.service';

export const createComment = async (userId: number, postId: number, content: string, parentId?: number) => {
  const comment = await prisma.comentario.create({
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
    await sendNotification(
      comment.postagem.postado_por,
      `${comment.autor.nome_usuario} comentou na sua postagem`,
      { type: 'post_comment', postId, commentId: comment.id_comentario }
    );
  }

  return comment;
};

export const getPostComments = async (postId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return prisma.comentario.findMany({
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

export const reactToComment = async (userId: number, commentId: number, reaction: 'upvote' | 'downvote') => {
  return prisma.comentario.update({
    where: { id_comentario: commentId },
    data: {
      [reaction]: { increment: 1 }
    }
  });
};
