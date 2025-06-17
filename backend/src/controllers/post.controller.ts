import { Request, Response } from 'express';
import {
  createPost,
  getPosts,
  reactToPost,
  updatePost,
  deletePost,
  getFeed
} from '../services/post.service';
import { upload } from '../utils/fileUpload';
import { sendNotification } from '../services/notification.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { content, type, groupId } = req.body;
    const post = await createPost({
      postado_por: req.user.id_usuario,
      conteudo: content,
      tipo: type,
      id_grupo: groupId ? parseInt(groupId) : null,
      midia: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json(post);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const uploadImagePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhuma imagem enviada' });
      return;
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const post = await createPost({
      postado_por: req.user.id_usuario,
      conteudo: req.body.content || '',
      tipo: 'image',
      id_grupo: req.body.groupId ? parseInt(req.body.groupId) : null,
      midia: imagePath
    });

    res.status(201).json(post);
  } catch (error) {
    const err = error as Error;
    console.error('Upload error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', groupId } = req.query;
    const posts = await getPosts({
      userId: req.user.id_usuario,  // Se precisar filtrar por usuário
      groupId: groupId ? parseInt(groupId as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json(posts);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const feed = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const posts = await getFeed(
      req.user.id_usuario,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(posts);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const react = async (req: Request, res: Response) => {
  try {
    const { reaction } = req.body;
    const post = await reactToPost(
      req.user.id_usuario,
      parseInt(req.params.postId),
      reaction
    );

    res.json(post);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deletePost(req.user.id_usuario, parseInt(req.params.postId));
    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { content, type, groupId, media } = req.body;
    const post = await updatePost(
      req.user.id_usuario,
      parseInt(req.params.postId),
      {
        conteudo: content,
        tipo: type,
        id_grupo: groupId ? parseInt(groupId) : null,
        midia: media
      }
    );
    res.json(post);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('não encontrada') || err.message.includes('Não autorizado')) {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
