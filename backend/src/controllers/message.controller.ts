import { Request, Response } from "express";
import {
  sendPrivateMessage,
  getConversation,
  getUserConversations,
} from "../services/message.service";
import { IRequest } from "@/types";

export const send = async (req: IRequest, res: Response) => {
  try {
    const { content } = req.body;
    const message = await sendPrivateMessage(
      req.user.id_usuario,
      parseInt(req.params.userId),
      content
    );

    res.status(201).json(message);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const conversation = async (req: IRequest, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const messages = await getConversation(
      req.user.id_usuario,
      parseInt(req.params.userId),
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(messages);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const conversations = async (req: IRequest, res: Response) => {
  try {
    const conversations = await getUserConversations(req.user.id_usuario);
    res.json(conversations);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
