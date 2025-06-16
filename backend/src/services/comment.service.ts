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

export const updateComment = async (
  userId: number,
  commentId: number,
  newContent: string
) => {
  // Primeiro verifica se o comentário existe e pertence ao usuário
  const existingComment = await prisma.comentario.findUnique({
    where: { id_comentario: commentId },
    select: { id_usuario: true }
  });

  if (!existingComment) {
    throw new Error('Comentário não encontrado');
  }

  if (existingComment.id_usuario !== userId) {
    throw new Error('Você não tem permissão para editar este comentário');
  }

  // Atualiza o comentário
  return prisma.comentario.update({
    where: { id_comentario: commentId },
    data: {
      conteudo: newContent,
      editado: true, // Adicione este campo ao seu modelo se quiser marcar como editado
      data_edicao: new Date() // Adicione este campo para registrar quando foi editado
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
