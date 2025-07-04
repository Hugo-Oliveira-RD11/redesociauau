import { Request, Response } from "express";
import {
  createComment,
  getPostComments,
  reactToComment,
  updateComment,
} from "../services/comment.service";
import { IRequest } from "@/types";

export const create = async (req: IRequest, res: Response) => {
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

export const list = async (req: IRequest, res: Response) => {
  try {
    const { page = "1", limit = "10" } = req.query;
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

export const react = async (req: IRequest, res: Response) => {
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

export const update = async (req: IRequest, res: Response) => {
  try {
    const { content } = req.body;
    const comment = await updateComment(
      req.user.id_usuario,
      parseInt(req.params.commentId),
      content
    );
    res.json(comment);
  } catch (error) {
    const err = error as Error;
    // Diferenciamos os códigos de status conforme o tipo de erro
    if (
      err.message.includes("não encontrado") ||
      err.message.includes("permissão")
    ) {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
