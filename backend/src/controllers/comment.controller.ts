import { Request, Response } from 'express';
import {
  createComment,
  getPostComments,
  reactToComment
} from '../services/comment.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { content, parentId } = req.body;
    const comment = await createComment(
      req.user.id_usuario,
      parseInt(req.params.postId),
      content,
      parentId ? parseInt(parentId) : undefined
    );

    res.status(201).json(comment);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const comments = await getPostComments(
      parseInt(req.params.postId),
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(comments);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const react = async (req: Request, res: Response) => {
  try {
    const { reaction } = req.body;
    const comment = await reactToComment(
      req.user.id_usuario,
      parseInt(req.params.commentId),
      reaction
    );

    res.json(comment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
